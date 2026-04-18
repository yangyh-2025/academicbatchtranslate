# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
"""
DocuTranslate Shared Server Layer

This module provides the shared TranslationService that encapsulates all core
translation task logic, used by both the Web backend (app.py) and MCP server.
"""

import asyncio
import base64
import json
import logging
import os
import shutil
import tempfile
import time
import uuid
from pathlib import Path
from typing import (
    List,
    Dict,
    Any,
    Optional,
    Type,
)

import httpx
from fastapi import HTTPException
from pydantic import TypeAdapter

from academicbatchtranslate import __version__
from academicbatchtranslate.agents.glossary_agent import GlossaryAgentConfig
from academicbatchtranslate.core.schemas import TranslatePayload
from academicbatchtranslate.utils.markdown_utils import mask_secrets
from academicbatchtranslate.exporter.md.types import ConvertEngineType
from academicbatchtranslate.global_values.conditional_import import DOCLING_EXIST
from academicbatchtranslate.workflow.ass_workflow import AssWorkflow, AssWorkflowConfig
from academicbatchtranslate.workflow.base import Workflow
from academicbatchtranslate.workflow.docx_workflow import DocxWorkflow, DocxWorkflowConfig
from academicbatchtranslate.workflow.epub_workflow import EpubWorkflow, EpubWorkflowConfig
from academicbatchtranslate.workflow.html_workflow import HtmlWorkflow, HtmlWorkflowConfig
from academicbatchtranslate.workflow.interfaces import (
    DocxExportable,
    EpubExportable,
    HTMLExportable,
    MDFormatsExportable,
    TXTExportable,
    JsonExportable,
    XlsxExportable,
    SrtExportable,
    CsvExportable,
    AssExportable,
    PPTXExportable,
)
from academicbatchtranslate.workflow.json_workflow import JsonWorkflow, JsonWorkflowConfig
from academicbatchtranslate.workflow.md_based_workflow import (
    MarkdownBasedWorkflow,
    MarkdownBasedWorkflowConfig,
)
from academicbatchtranslate.workflow.pptx_workflow import PPTXWorkflow, PPTXWorkflowConfig
from academicbatchtranslate.workflow.srt_workflow import SrtWorkflow, SrtWorkflowConfig
from academicbatchtranslate.workflow.txt_workflow import TXTWorkflow, TXTWorkflowConfig
from academicbatchtranslate.workflow.xlsx_workflow import XlsxWorkflow, XlsxWorkflowConfig
from academicbatchtranslate.logger import global_logger
from academicbatchtranslate.progress import ProgressTracker
from academicbatchtranslate.translator import default_params

if DOCLING_EXIST:
    from academicbatchtranslate.converter.x2md.converter_docling import ConverterDoclingConfig
from academicbatchtranslate.converter.x2md.converter_mineru import ConverterMineruConfig
from academicbatchtranslate.converter.x2md.converter_mineru_deploy import ConverterMineruDeployConfig
from academicbatchtranslate.exporter.md.md2html_exporter import MD2HTMLExporterConfig
from academicbatchtranslate.exporter.md.md2docx_exporter import MD2DocxExporterConfig
from academicbatchtranslate.exporter.txt.txt2html_exporter import TXT2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.md_translator import MDTranslatorConfig
from academicbatchtranslate.translator.ai_translator.txt_translator import TXTTranslatorConfig
from academicbatchtranslate.translator.ai_translator.json_translator import JsonTranslatorConfig
from academicbatchtranslate.exporter.js.json2html_exporter import Json2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.xlsx_translator import XlsxTranslatorConfig
from academicbatchtranslate.exporter.xlsx.xlsx2html_exporter import Xlsx2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.docx_translator import DocxTranslatorConfig
from academicbatchtranslate.exporter.docx.docx2html_exporter import Docx2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.srt_translator import SrtTranslatorConfig
from academicbatchtranslate.exporter.srt.srt2html_exporter import Srt2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.epub_translator import EpubTranslatorConfig
from academicbatchtranslate.exporter.epub.epub2html_exporter import Epub2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.html_translator import HtmlTranslatorConfig
from academicbatchtranslate.translator.ai_translator.ass_translator import AssTranslatorConfig
from academicbatchtranslate.exporter.ass.ass2html_exporter import Ass2HTMLExporterConfig
from academicbatchtranslate.translator.ai_translator.pptx_translator import PPTXTranslatorConfig
from academicbatchtranslate.exporter.pptx.pptx2html_exporter import PPTX2HTMLExporterConfig


MAX_LOG_HISTORY = 200


# --- Workflow dictionary ---
WORKFLOW_DICT: Dict[str, Type[Workflow]] = {
    "markdown_based": MarkdownBasedWorkflow,
    "txt": TXTWorkflow,
    "json": JsonWorkflow,
    "xlsx": XlsxWorkflow,
    "docx": DocxWorkflow,
    "srt": SrtWorkflow,
    "epub": EpubWorkflow,
    "html": HtmlWorkflow,
    "ass": AssWorkflow,
    "pptx": PPTXWorkflow,
}


# --- Media types mapping ---
MEDIA_TYPES = {
    "html": "text/html; charset=utf-8",
    "markdown": "text/markdown; charset=utf-8",
    "markdown_zip": "application/zip",
    "txt": "text/plain; charset=utf-8",
    "json": "application/json; charset=utf-8",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "csv": "text/csv; charset=utf-8",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "srt": "text/plain; charset=utf-8",
    "epub": "application/epub+zip",
    "ass": "text/plain; charset=utf-8",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "pdf": "application/pdf",
}


class QueueAndHistoryHandler(logging.Handler):
    """Logging handler that stores logs in both a history list and an asyncio.Queue."""

    def __init__(
        self,
        queue_ref: asyncio.Queue,
        history_list_ref: List[str],
        max_history_items: int,
        task_id: str,
    ):
        super().__init__()
        self.queue = queue_ref
        self.history_list = history_list_ref
        self.max_history = max_history_items
        self.task_id = task_id

    def emit(self, record: logging.LogRecord):
        log_entry = self.format(record)
        # 过滤敏感信息后再存储和输出
        masked_log_entry = mask_secrets(log_entry)
        print(f"[{self.task_id}] {masked_log_entry}")
        self.history_list.append(masked_log_entry)
        if len(self.history_list) > self.max_history:
            del self.history_list[: len(self.history_list) - self.max_history]
        if self.queue is not None:
            try:
                # Try to get the main event loop - this will be set by the application
                self.queue.put_nowait(masked_log_entry)
            except asyncio.QueueFull:
                print(f"[{self.task_id}] Log queue is full. Log dropped: {masked_log_entry}")
            except Exception as e:
                print(
                    f"[{self.task_id}] Error putting log to queue: {e}. Log: {masked_log_entry}"
                )


def get_workflow_type_from_filename(filename: str) -> str:
    """Get workflow type based on file extension."""
    ext = Path(filename).suffix.lower()
    if ext in [".pdf", ".png", ".jpg"]:
        return "markdown_based"
    elif ext in [".md", ".markdown"]:
        return "markdown_based"
    elif ext in [".docx", ".doc"]:
        return "docx"
    elif ext in [".csv", ".xlsx", ".xls"]:
        return "xlsx"
    elif ext in [".pptx", ".ppt"]:
        return "pptx"
    elif ext in [".json"]:
        return "json"
    elif ext in [".srt"]:
        return "srt"
    elif ext in [".ass"]:
        return "ass"
    elif ext in [".epub"]:
        return "epub"
    elif ext in [".html", ".htm"]:
        return "html"
    elif ext in [".txt"]:
        return "txt"
    else:
        return "txt"


def _create_default_task_state() -> Dict[str, Any]:
    """Create a new default task state."""
    return {
        "is_processing": False,
        "status_message": "空闲",
        "error_flag": False,
        "download_ready": False,
        "progress_percent": 0,
        "workflow_instance": None,
        "original_filename_stem": None,
        "task_start_time": 0,
        "task_end_time": 0,
        "current_task_ref": None,
        "original_filename": None,
        "temp_dir": None,
        "downloadable_files": {},
        "attachment_files": {},
    }


class TranslationService:
    """
    Shared translation service that provides core task management functionality.

    This class is used by both the Web backend (app.py) and MCP server to ensure
    consistent task management across both interfaces.
    """

    def __init__(self):
        # Task state storage
        self.tasks_state: Dict[str, Dict[str, Any]] = {}
        self.tasks_log_queues: Dict[str, asyncio.Queue] = {}
        self.tasks_log_histories: Dict[str, List[str]] = {}

        # Batch task state storage
        self.batch_tasks_state: Dict[str, Dict[str, Any]] = {}

        # HTTP client for CDN checks
        self.httpx_client: Optional[httpx.AsyncClient] = None

        # Lock for thread-safe operations
        self._lock = asyncio.Lock()

        # Reference to main event loop (set by application)
        self.main_event_loop: Optional[asyncio.AbstractEventLoop] = None

        # Playwright browser installation status
        self._playwright_browsers_installed = False

    def initialize(self, httpx_client: httpx.AsyncClient, main_event_loop: asyncio.AbstractEventLoop):
        """Initialize the service with HTTP client and event loop."""
        self.httpx_client = httpx_client
        self.main_event_loop = main_event_loop

    def clear_all(self):
        """Clear all task states (called during application startup)."""
        self.tasks_state.clear()
        self.tasks_log_queues.clear()
        self.tasks_log_histories.clear()

    def list_tasks(self) -> List[str]:
        """List all task IDs."""
        return list(self.tasks_state.keys())

    def get_task_state(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task state by ID."""
        return self.tasks_state.get(task_id)

    def get_task_logs(self, task_id: str) -> List[str]:
        """Get task log history by ID."""
        return self.tasks_log_histories.get(task_id, [])

    async def get_new_logs(self, task_id: str) -> List[str]:
        """Get new logs from the queue."""
        if task_id not in self.tasks_log_queues:
            raise HTTPException(
                status_code=404, detail=f"找不到任务ID '{task_id}' 的日志队列。"
            )
        log_queue = self.tasks_log_queues[task_id]
        new_logs = []
        while not log_queue.empty():
            try:
                new_logs.append(log_queue.get_nowait())
                log_queue.task_done()
            except asyncio.QueueEmpty:
                break
        return new_logs

    def get_downloadable_file_path(self, task_id: str, file_type: str) -> Optional[Dict[str, str]]:
        """Get downloadable file info."""
        task_state = self.tasks_state.get(task_id)
        if not task_state:
            return None
        return task_state.get("downloadable_files", {}).get(file_type)

    def get_attachment_file_path(self, task_id: str, identifier: str) -> Optional[Dict[str, str]]:
        """Get attachment file info."""
        task_state = self.tasks_state.get(task_id)
        if not task_state:
            return None
        return task_state.get("attachment_files", {}).get(identifier)

    async def start_translation(
        self,
        task_id: str,
        payload: TranslatePayload,
        file_contents: bytes,
        original_filename: str,
    ) -> Dict[str, Any]:
        """
        Start a translation task.

        Args:
            task_id: Unique task identifier
            payload: Translation parameters
            file_contents: File content bytes
            original_filename: Original filename

        Returns:
            Response dict with task_id and status
        """
        # Auto workflow routing
        if payload.workflow_type == "auto":
            detected_type = get_workflow_type_from_filename(original_filename)
            print(f"[{task_id}] 自动识别工作流: {original_filename} -> {detected_type}")

            # 关键修复：完全手动构造 payload_data，不依赖 model_dump
            # 这样可以确保所有字段都正确传递，不会因为 exclude_none 或其他原因丢失
            payload_data = {
                "workflow_type": detected_type,
                "original_workflow_type": "auto",  # 标记原始工作流类型，用于验证器跳过 base_url 检查
            }

            # 从 BaseWorkflowParams 复制所有字段
            base_fields = [
                "skip_translate", "base_url", "api_key", "model_id", "to_lang",
                "chunk_size", "concurrent", "temperature", "top_p", "timeout", "thinking", "retry",
                "system_proxy_enable", "custom_prompt", "glossary_dict",
                "glossary_generate_enable", "glossary_agent_config",
                "force_json", "rpm", "tpm", "provider", "extra_body"
            ]
            for field_name in base_fields:
                if hasattr(payload, field_name):
                    value = getattr(payload, field_name)
                    if value is not None and value != "":
                        payload_data[field_name] = value

            # 从 UniversalParamsMixin 复制所有字段（关键！）
            universal_fields = [
                "convert_engine", "mineru_token", "model_version", "formula_ocr", "code_ocr",
                "mineru_language",
                "mineru_deploy_base_url", "mineru_deploy_backend", "mineru_deploy_parse_method",
                "mineru_deploy_table_enable", "mineru_deploy_formula_enable",
                "mineru_deploy_start_page_id", "mineru_deploy_end_page_id",
                "mineru_deploy_lang_list", "mineru_deploy_server_url",
                "insert_mode", "separator", "translate_regions", "json_paths", "md2docx_engine"
            ]
            for field_name in universal_fields:
                if hasattr(payload, field_name):
                    value = getattr(payload, field_name)
                    if value is not None:
                        # 注意：mineru_token 即使是空字符串也要保留，因为 MarkdownWorkflowParams 的默认值是空字符串
                        # 但如果用户明确传入了 token（非空），我们需要保留它
                        if isinstance(value, str) and value == "" and field_name != "mineru_token":
                            continue  # 跳过空字符串，除了 mineru_token
                        payload_data[field_name] = value
                        print(f"[{task_id}] 复制字段 {field_name}: {type(value).__name__}" +
                              (f" (len={len(value)})" if isinstance(value, str) else ""))

            # 调试日志
            print(f"[{task_id}] payload_data keys: {sorted(payload_data.keys())}")
            if "mineru_token" in payload_data:
                token = payload_data["mineru_token"]
                print(f"[{task_id}] mineru_token in payload_data (length: {len(token)}, starts with: {token[:20] if len(token) > 20 else token}...)")
            if "convert_engine" in payload_data:
                print(f"[{task_id}] convert_engine: {payload_data['convert_engine']}")

            if detected_type == "json" and not payload_data.get("json_paths"):
                payload_data["json_paths"] = ["$..*"]

            if detected_type == "markdown_based" and not payload_data.get("convert_engine"):
                if Path(original_filename).suffix.lower() == ".pdf":
                    # 检查是否有mineru_token，只有提供了token才使用mineru
                    if payload_data.get("mineru_token"):
                        payload_data["convert_engine"] = "mineru"
                    elif DOCLING_EXIST:
                        payload_data["convert_engine"] = "docling"
                    else:
                        # 两个都不可用时，使用mineru但会提示用户需要token
                        payload_data["convert_engine"] = "mineru"
                else:
                    payload_data["convert_engine"] = "identity"

            try:
                payload = TypeAdapter(TranslatePayload).validate_python(payload_data)
                # 验证后再次检查
                if hasattr(payload, "mineru_token"):
                    token = payload.mineru_token
                    print(f"[{task_id}] After validation: mineru_token present (length: {len(token) if token else 0})")
                    if token:
                        print(f"[{task_id}] mineru_token starts with: {token[:20] if len(token) > 20 else token}")
                if hasattr(payload, "convert_engine"):
                    print(f"[{task_id}] After validation: convert_engine={payload.convert_engine}")
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"自动转换工作流参数失败: {mask_secrets(str(e))}")

        if task_id not in self.tasks_state:
            self.tasks_state[task_id] = _create_default_task_state()
            self.tasks_log_queues[task_id] = asyncio.Queue()
            self.tasks_log_histories[task_id] = []
        task_state = self.tasks_state[task_id]

        if (
            task_state["is_processing"]
            and task_state["current_task_ref"]
            and not task_state["current_task_ref"].done()
        ):
            raise HTTPException(
                status_code=429, detail=f"任务ID '{task_id}' 正在进行中，请稍后再试。"
            )

        if task_state.get("temp_dir") and os.path.isdir(task_state["temp_dir"]):
            shutil.rmtree(task_state["temp_dir"])

        raw_stem = Path(original_filename).stem
        safe_stem = raw_stem[:50] if len(raw_stem) > 50 else raw_stem

        task_state.update(
            {
                "is_processing": True,
                "status_message": "任务初始化中...",
                "error_flag": False,
                "download_ready": False,
                "workflow_instance": None,
                "original_filename_stem": safe_stem,
                "original_filename": original_filename,
                "task_start_time": time.time(),
                "task_end_time": 0,
                "current_task_ref": None,
                "temp_dir": None,
                "downloadable_files": {},
                "attachment_files": {},
                "payload": payload,
            }
        )

        log_history = self.tasks_log_histories[task_id]
        log_queue = self.tasks_log_queues[task_id]
        log_history.clear()
        while not log_queue.empty():
            try:
                log_queue.get_nowait()
            except asyncio.QueueEmpty:
                break

        initial_log_msg = f"收到新的翻译请求: {original_filename}"
        print(f"[{task_id}] {initial_log_msg}")
        await log_queue.put(initial_log_msg)

        try:
            loop = asyncio.get_running_loop()
            task = loop.create_task(
                self._perform_translation(task_id, payload, file_contents, original_filename)
            )
            task_state["current_task_ref"] = task
            return {
                "task_started": True,
                "task_id": task_id,
                "message": "翻译任务已成功启动，请稍候...",
            }
        except Exception as e:
            task_state.update(
                {
                    "is_processing": False,
                    "status_message": f"启动任务失败: {e}",
                    "error_flag": True,
                    "current_task_ref": None,
                }
            )
            raise HTTPException(status_code=500, detail=f"启动翻译任务时出错: {mask_secrets(str(e))}")

    async def _perform_translation(
        self,
        task_id: str,
        payload: TranslatePayload,
        file_contents: bytes,
        original_filename: str,
    ):
        """Perform the actual translation work."""
        task_state = self.tasks_state[task_id]
        log_queue = self.tasks_log_queues[task_id]
        log_history = self.tasks_log_histories[task_id]

        task_logger = logging.getLogger(f"task.{task_id}")
        task_logger.setLevel(logging.INFO)
        task_logger.propagate = False
        if task_logger.hasHandlers():
            task_logger.handlers.clear()
        task_handler = QueueAndHistoryHandler(
            log_queue, log_history, MAX_LOG_HISTORY, task_id=task_id
        )
        task_handler.setFormatter(
            logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        )
        task_logger.addHandler(task_handler)

        task_logger.info(
            f"后台翻译任务开始: 文件 '{original_filename}', 工作流: '{payload.workflow_type}'"
        )
        task_state["status_message"] = f"正在处理 '{original_filename}'..."

        def update_progress(percent: int, message: str):
            task_state["progress_percent"] = percent
            if message:
                task_state["status_message"] = message

        progress_tracker = ProgressTracker(
            logger=task_logger,
            callback=update_progress
        )

        temp_dir = None

        try:
            workflow_class = WORKFLOW_DICT.get(payload.workflow_type)
            if not workflow_class:
                raise ValueError(f"不支持的工作流类型: '{payload.workflow_type}'")

            workflow: Workflow

            def build_glossary_agent_config():
                if payload.glossary_generate_enable and payload.glossary_agent_config:
                    agent_payload = payload.glossary_agent_config
                    return GlossaryAgentConfig(
                        logger=task_logger, **agent_payload.model_dump()
                    )
                return None

            if hasattr(payload, 'md2docx_engine'):
                md2docx_engine = payload.md2docx_engine
            else:
                md2docx_engine = "auto"

            workflow = self._create_workflow(
                payload, task_logger, progress_tracker, build_glossary_agent_config, md2docx_engine
            )

            file_stem = task_state["original_filename_stem"]
            file_suffix = Path(original_filename).suffix
            workflow.read_bytes(content=file_contents, stem=file_stem, suffix=file_suffix)
            await workflow.translate_async()

            task_logger.info("翻译完成，正在生成临时结果文件...")
            temp_dir = tempfile.mkdtemp(prefix=f"academicbatchtranslate_{task_id}_")
            task_state["temp_dir"] = temp_dir

            # 保存原始文件内容到临时目录
            original_file_path = os.path.join(temp_dir, f"original_{original_filename}")
            with open(original_file_path, 'wb') as f:
                f.write(file_contents)
            task_state["original_file_path"] = original_file_path

            downloadable_files = {}
            filename_stem = task_state["original_filename_stem"]

            is_cdn_available = True
            if self.httpx_client is not None:
                try:
                    await self.httpx_client.head(
                        "https://s4.zstatic.net/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js",
                        timeout=3,
                    )
                except (httpx.TimeoutException, httpx.RequestError):
                    is_cdn_available = False
                    task_logger.warning("CDN连接失败，将使用本地JS进行渲染。")
            else:
                is_cdn_available = False
                task_logger.warning("HTTP客户端未初始化，将使用本地JS进行渲染。")

            export_map = self._build_export_map(
                workflow, filename_stem, is_cdn_available, payload
            )

            for file_type, (export_func, filename, is_string_output) in export_map.items():
                try:
                    content = await asyncio.to_thread(export_func)
                    content_bytes = content.encode("utf-8") if is_string_output else content
                    file_path = os.path.join(temp_dir, filename)
                    with open(file_path, "wb") as f:
                        f.write(content_bytes)
                    downloadable_files[file_type] = {
                        "path": file_path,
                        "filename": filename,
                    }
                    task_logger.info(f"成功生成 {file_type} 文件")
                except Exception as export_error:
                    task_logger.error(
                        f"生成 {file_type} 文件时出错: {export_error}", exc_info=True
                    )

            # 在翻译完成时提前生成 PDF，避免下载时长时间等待
            task_logger.info("正在生成 PDF 文件...")
            if "html" in downloadable_files:
                html_path = downloadable_files["html"]["path"]
                pdf_content = await self._html_to_pdf(html_path)
                if pdf_content:
                    pdf_filename = self._format_filename(filename_stem, ".pdf", payload)
                    pdf_path = os.path.join(temp_dir, pdf_filename)
                    with open(pdf_path, "wb") as f:
                        f.write(pdf_content)
                    downloadable_files["pdf"] = {
                        "path": pdf_path,
                        "filename": pdf_filename,
                    }
                    task_logger.info(f"成功生成 PDF 文件: {pdf_filename}")
                else:
                    task_logger.warning("PDF 生成失败，请检查 Playwright 安装")
            else:
                task_logger.warning("没有可用的 HTML 文件，跳过 PDF 生成")

            attachment_files = {}
            attachment_object = workflow.get_attachment()
            if attachment_object and attachment_object.attachment_dict:
                task_logger.info(
                    f"发现 {len(attachment_object.attachment_dict)} 个附件，正在处理..."
                )
                for identifier, doc in attachment_object.attachment_dict.items():
                    try:
                        attachment_filename = f"{doc.stem or identifier}{doc.suffix}"
                        attachment_path = os.path.join(temp_dir, attachment_filename)
                        with open(attachment_path, "wb") as f:
                            f.write(doc.content)
                        attachment_files[identifier] = {
                            "path": attachment_path,
                            "filename": attachment_filename,
                        }
                        task_logger.info(
                            f"成功生成附件 '{identifier}' 文件: {attachment_filename}"
                        )
                    except Exception as attachment_error:
                        task_logger.error(
                            f"生成附件 '{identifier}' 文件时出错: {attachment_error}",
                            exc_info=True,
                        )

            end_time = time.time()
            duration = end_time - task_state["task_start_time"]
            task_state.update(
                {
                    "status_message": f"翻译成功！用时 {duration:.2f} 秒。",
                    "download_ready": True,
                    "error_flag": False,
                    "progress_percent": 100,
                    "task_end_time": end_time,
                    "downloadable_files": downloadable_files,
                    "attachment_files": attachment_files,
                }
            )
            task_logger.info(f"翻译成功完成，用时 {duration:.2f} 秒。")

        except asyncio.CancelledError:
            end_time = time.time()
            duration = end_time - task_state["task_start_time"]
            task_logger.info(
                f"翻译任务 '{original_filename}' 已被取消 (用时 {duration:.2f} 秒)."
            )
            task_state.update(
                {
                    "status_message": f"翻译任务已取消 (用时 {duration:.2f} 秒).",
                    "error_flag": False,
                    "download_ready": False,
                    "progress_percent": 100,
                    "task_end_time": end_time,
                }
            )
        except Exception as e:
            end_time = time.time()
            duration = end_time - task_state["task_start_time"]
            error_message = f"翻译失败: {e}"
            task_logger.error(error_message, exc_info=True)
            task_state.update(
                {
                    "status_message": f"翻译过程中发生错误 (用时 {duration:.2f} 秒): {mask_secrets(str(e))}",
                    "error_flag": True,
                    "download_ready": False,
                    "progress_percent": 100,
                    "task_end_time": end_time,
                }
            )
        finally:
            task_state["workflow_instance"] = None
            task_state["is_processing"] = False
            task_state["current_task_ref"] = None

            if task_state["error_flag"] and temp_dir and os.path.isdir(temp_dir):
                shutil.rmtree(temp_dir)
                task_logger.info(f"因任务失败，已清理临时目录")
                task_state["temp_dir"] = None

            task_logger.info(f"后台翻译任务 '{original_filename}' 处理结束。")
            task_logger.removeHandler(task_handler)

    def _create_workflow(
        self,
        payload: TranslatePayload,
        task_logger: logging.Logger,
        progress_tracker: ProgressTracker,
        build_glossary_agent_config,
        md2docx_engine: str,
    ) -> Workflow:
        """Create workflow instance based on payload type."""
        from academicbatchtranslate.core.schemas import (
            MarkdownWorkflowParams,
            TextWorkflowParams,
            JsonWorkflowParams,
            XlsxWorkflowParams,
            DocxWorkflowParams,
            SrtWorkflowParams,
            EpubWorkflowParams,
            HtmlWorkflowParams,
            AssWorkflowParams,
            PPTXWorkflowParams,
        )

        if isinstance(payload, MarkdownWorkflowParams):
            task_logger.info("构建 MarkdownBasedWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = MDTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            converter_config = None
            if payload.convert_engine == "mineru":
                token = payload.mineru_token or ""
                task_logger.info(f"Creating ConverterMineruConfig with mineru_token (length: {len(token)})")
                if token:
                    task_logger.info(f"mineru_token starts with: {token[:20] if len(token) > 20 else token}")
                converter_config = ConverterMineruConfig(
                    logger=task_logger,
                    mineru_token=token,
                    formula_ocr=payload.formula_ocr,
                    model_version=payload.model_version,
                    language=payload.mineru_language,
                )
            elif payload.convert_engine == "mineru_deploy":
                converter_config = ConverterMineruDeployConfig(
                    base_url=payload.mineru_deploy_base_url,
                    backend=payload.mineru_deploy_backend,
                    parse_method=payload.mineru_deploy_parse_method,
                    formula_enable=payload.mineru_deploy_formula_enable,
                    table_enable=payload.mineru_deploy_table_enable,
                    start_page_id=payload.mineru_deploy_start_page_id,
                    end_page_id=payload.mineru_deploy_end_page_id,
                    lang_list=payload.mineru_deploy_lang_list,
                    server_url=payload.mineru_deploy_server_url,
                )
            elif payload.convert_engine == "docling" and DOCLING_EXIST:
                converter_config = ConverterDoclingConfig(
                    logger=task_logger,
                    code_ocr=payload.code_ocr,
                    formula_ocr=payload.formula_ocr,
                )
            html_exporter_config = MD2HTMLExporterConfig(cdn=True)
            md2docx_exporter_config = MD2DocxExporterConfig(
                engine=md2docx_engine
            ) if md2docx_engine is not None else None
            workflow_config = MarkdownBasedWorkflowConfig(
                convert_engine=payload.convert_engine,
                converter_config=converter_config,
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                md2docx_exporter_config=md2docx_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return MarkdownBasedWorkflow(config=workflow_config)

        elif isinstance(payload, TextWorkflowParams):
            task_logger.info("构建 TXTWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "glossary_dict",
                    "insert_mode",
                    "separator",
                    "segment_mode",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = TXTTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = TXT2HTMLExporterConfig(cdn=True)
            workflow_config = TXTWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return TXTWorkflow(config=workflow_config)

        elif isinstance(payload, JsonWorkflowParams):
            task_logger.info("构建 JsonWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "glossary_dict",
                    "json_paths",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = JsonTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = Json2HTMLExporterConfig(cdn=True)
            workflow_config = JsonWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return JsonWorkflow(config=workflow_config)

        elif isinstance(payload, XlsxWorkflowParams):
            task_logger.info("构建 XlsxWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "translate_regions",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = XlsxTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = Xlsx2HTMLExporterConfig(cdn=True)
            workflow_config = XlsxWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return XlsxWorkflow(config=workflow_config)

        elif isinstance(payload, DocxWorkflowParams):
            task_logger.info("构建 DocxWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = DocxTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = Docx2HTMLExporterConfig(cdn=True)
            workflow_config = DocxWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return DocxWorkflow(config=workflow_config)

        elif isinstance(payload, SrtWorkflowParams):
            task_logger.info("构建 SrtWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = SrtTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = Srt2HTMLExporterConfig(cdn=True)
            workflow_config = SrtWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return SrtWorkflow(config=workflow_config)

        elif isinstance(payload, EpubWorkflowParams):
            task_logger.info("构建 EpubWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = EpubTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = Epub2HTMLExporterConfig(cdn=True)
            workflow_config = EpubWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return EpubWorkflow(config=workflow_config)

        elif isinstance(payload, HtmlWorkflowParams):
            task_logger.info("构建 HtmlWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = HtmlTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            workflow_config = HtmlWorkflowConfig(
                translator_config=translator_config, logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return HtmlWorkflow(config=workflow_config)

        elif isinstance(payload, AssWorkflowParams):
            task_logger.info("构建 AssWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = AssTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = Ass2HTMLExporterConfig(cdn=True)
            workflow_config = AssWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return AssWorkflow(config=workflow_config)

        elif isinstance(payload, PPTXWorkflowParams):
            task_logger.info("构建 PPTXWorkflow 配置。")
            translator_args = payload.model_dump(
                include={
                    "skip_translate",
                    "base_url",
                    "api_key",
                    "model_id",
                    "to_lang",
                    "custom_prompt",
                    "temperature",
                    "top_p",
                    "thinking",
                    "chunk_size",
                    "concurrent",
                    "insert_mode",
                    "separator",
                    "glossary_dict",
                    "timeout",
                    "retry",
                    "system_proxy_enable",
                    "force_json",
                    "rpm",
                    "tpm",
                    "provider",
                    "extra_body",
                },
                exclude_none=True,
            )
            translator_args["glossary_generate_enable"] = payload.glossary_generate_enable
            translator_args["glossary_agent_config"] = build_glossary_agent_config()
            translator_config = PPTXTranslatorConfig(**translator_args)
            translator_config.progress_tracker = progress_tracker

            html_exporter_config = PPTX2HTMLExporterConfig(cdn=True)
            workflow_config = PPTXWorkflowConfig(
                translator_config=translator_config,
                html_exporter_config=html_exporter_config,
                logger=task_logger,
                progress_tracker=progress_tracker,
            )
            return PPTXWorkflow(config=workflow_config)

        else:
            raise TypeError(f"工作流类型 '{payload.workflow_type}' 的处理逻辑未实现。")

    def _format_filename(self, original_stem: str, extension: str, payload: Optional[TranslatePayload] = None) -> str:
        """
        格式化输出文件名。

        Args:
            original_stem: 原始文件名（不含扩展名）
            extension: 文件扩展名（包含点，如 ".md"）
            payload: 翻译参数，包含文件名配置

        Returns:
            格式化后的文件名
        """
        import time

        prefix = ""
        suffix = "_translated"
        custom_name = None

        if payload:
            prefix = getattr(payload, "output_filename_prefix", "") or ""
            suffix = getattr(payload, "output_filename_suffix", "_translated") or "_translated"
            custom_name = getattr(payload, "output_filename_custom", None)
            print(f"[DEBUG] _format_filename: original_stem={original_stem}, prefix={repr(prefix)}, suffix={repr(suffix)}, custom_name={custom_name}")

        if custom_name:
            # 使用自定义文件名，支持占位符
            timestamp = str(int(time.time()))
            name = custom_name.replace("{original}", original_stem)
            name = name.replace("{timestamp}", timestamp)
            result = f"{name}{extension}"
            print(f"[DEBUG] _format_filename result (custom): {result}")
            return result
        else:
            # 使用前缀和后缀
            result = f"{prefix}{original_stem}{suffix}{extension}"
            print(f"[DEBUG] _format_filename result (prefix/suffix): {result}")
            return result

    def _build_export_map(
        self,
        workflow: Workflow,
        filename_stem: str,
        is_cdn_available: bool,
        payload: Optional[TranslatePayload] = None,
    ) -> Dict[str, Any]:
        """Build export map based on workflow capabilities."""
        export_map = {}

        if isinstance(workflow, MDFormatsExportable):
            export_map["markdown"] = (
                workflow.export_to_markdown,
                self._format_filename(filename_stem, ".md", payload),
                True,
            )
            export_map["markdown_zip"] = (
                workflow.export_to_markdown_zip,
                self._format_filename(filename_stem, ".zip", payload),
                False,
            )
        if isinstance(workflow, TXTExportable):
            export_map["txt"] = (
                workflow.export_to_txt,
                self._format_filename(filename_stem, ".txt", payload),
                True,
            )
        if isinstance(workflow, JsonExportable):
            export_map["json"] = (
                workflow.export_to_json,
                self._format_filename(filename_stem, ".json", payload),
                True,
            )
        if isinstance(workflow, XlsxExportable):
            export_map["xlsx"] = (
                workflow.export_to_xlsx,
                self._format_filename(filename_stem, ".xlsx", payload),
                False,
            )
        if isinstance(workflow, CsvExportable):
            export_map["csv"] = (
                workflow.export_to_csv,
                self._format_filename(filename_stem, ".csv", payload),
                False,
            )
        if isinstance(workflow, DocxExportable):
            # MarkdownBasedWorkflow needs md2docx_exporter_config
            if isinstance(workflow, MarkdownBasedWorkflow):
                if hasattr(workflow.config, 'md2docx_exporter_config') and workflow.config.md2docx_exporter_config is not None:
                    export_map["docx"] = (
                        workflow.export_to_docx,
                        self._format_filename(filename_stem, ".docx", payload),
                        False,
                    )
            # DocxWorkflow can export docx directly
            elif isinstance(workflow, DocxWorkflow):
                export_map["docx"] = (
                    workflow.export_to_docx,
                    self._format_filename(filename_stem, ".docx", payload),
                    False,
                )
        if isinstance(workflow, SrtExportable):
            export_map["srt"] = (
                workflow.export_to_srt,
                self._format_filename(filename_stem, ".srt", payload),
                True,
            )
        if isinstance(workflow, EpubExportable):
            export_map["epub"] = (
                workflow.export_to_epub,
                self._format_filename(filename_stem, ".epub", payload),
                False,
            )
        if isinstance(workflow, AssExportable):
            export_map["ass"] = (
                workflow.export_to_ass,
                self._format_filename(filename_stem, ".ass", payload),
                True,
            )
        if isinstance(workflow, PPTXExportable):
            export_map["pptx"] = (
                workflow.export_to_pptx,
                self._format_filename(filename_stem, ".pptx", payload),
                False,
            )

        if isinstance(workflow, HTMLExportable):
            html_config = None
            if isinstance(workflow, MarkdownBasedWorkflow):
                html_config = MD2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, TXTWorkflow):
                html_config = TXT2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, JsonWorkflow):
                html_config = Json2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, XlsxWorkflow):
                html_config = Xlsx2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, DocxWorkflow):
                html_config = Docx2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, SrtWorkflow):
                html_config = Srt2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, EpubWorkflow):
                html_config = Epub2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, AssWorkflow):
                html_config = Ass2HTMLExporterConfig(cdn=is_cdn_available)
            elif isinstance(workflow, PPTXWorkflow):
                html_config = PPTX2HTMLExporterConfig(cdn=is_cdn_available)
            export_map["html"] = (
                lambda: workflow.export_to_html(html_config),
                self._format_filename(filename_stem, ".html", payload),
                True,
            )

        return export_map

    def cancel_task(self, task_id: str) -> Dict[str, Any]:
        """Cancel a running task."""
        task_state = self.tasks_state.get(task_id)
        if not task_state:
            raise HTTPException(status_code=404, detail=f"找不到任务ID '{task_id}'。")
        if (
            not task_state
            or not task_state["is_processing"]
            or not task_state["current_task_ref"]
        ):
            raise HTTPException(
                status_code=400, detail=f"任务ID '{task_id}' 没有正在进行的翻译任务可取消。"
            )

        task_to_cancel: Optional[asyncio.Task] = task_state["current_task_ref"]
        if not task_to_cancel or task_to_cancel.done():
            task_state["is_processing"] = False
            task_state["current_task_ref"] = None
            raise HTTPException(status_code=400, detail="任务已完成或已被取消。")

        print(f"[{task_id}] 收到取消翻译任务的请求。")
        task_to_cancel.cancel()
        task_state["status_message"] = "正在取消任务..."
        return {"cancelled": True, "message": "取消请求已发送。请等待状态更新。"}

    async def release_task(self, task_id: str) -> Dict[str, Any]:
        """Release task resources."""
        if task_id not in self.tasks_state:
            return {
                "released": False,
                "message": f"找不到任务ID '{task_id}'。"
            }
        task_state = self.tasks_state.get(task_id)
        message_parts = []
        if (
            task_state
            and task_state.get("is_processing")
            and task_state.get("current_task_ref")
        ):
            try:
                print(f"[{task_id}] 任务正在进行中，将在释放前尝试取消。")
                self.cancel_task(task_id)
                message_parts.append("任务已被取消。")
            except HTTPException as e:
                print(f"[{task_id}] 取消任务时出现预期中的情况（可能已完成）: {e.detail}")
                message_parts.append(f"任务取消步骤已跳过（可能已完成或取消）。")

        if task_state:
            temp_dir = task_state.get("temp_dir")
            if temp_dir and os.path.isdir(temp_dir):
                try:
                    shutil.rmtree(temp_dir)
                    message_parts.append("临时文件已清理。")
                    print(f"[{task_id}] 临时目录 '{temp_dir}' 已被删除。")
                except Exception as e:
                    message_parts.append(f"清理临时文件时出错: {e}。")
                    print(f"[{task_id}] 删除临时目录 '{temp_dir}' 时出错: {e}")

        self.tasks_state.pop(task_id, None)
        self.tasks_log_queues.pop(task_id, None)
        self.tasks_log_histories.pop(task_id, None)
        print(f"[{task_id}] 资源已成功释放。")
        message_parts.append(f"任务 '{task_id}' 的资源已释放。")
        return {"released": True, "message": " ".join(message_parts)}

    async def cleanup_all(self):
        """Cleanup all resources (called during application shutdown)."""
        pending_tasks = []
        for task_id, task_state in self.tasks_state.items():
            task_ref = task_state.get("current_task_ref")
            if task_ref and not task_ref.done():
                print(f"[{task_id}] 检测到未完成任务，正在强制取消...")
                task_ref.cancel()
                pending_tasks.append(task_ref)

        if pending_tasks:
            await asyncio.gather(*pending_tasks, return_exceptions=True)

        for task_id, task_state in self.tasks_state.items():
            temp_dir = task_state.get("temp_dir")
            if temp_dir and os.path.isdir(temp_dir):
                try:
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    print(f"[{task_id}] 临时目录已清理: {temp_dir}")
                except Exception as e:
                    print(f"[{task_id}] 清理临时目录 '{temp_dir}' 时出错: {e}")

        # Cleanup HTTP client
        if self.httpx_client is not None:
            try:
                await self.httpx_client.aclose()
                print("[TranslationService] HTTP客户端已关闭")
            except Exception as e:
                print(f"[TranslationService] 关闭HTTP客户端时出错: {e}")
            finally:
                self.httpx_client = None

    # ===================================================================
    # --- Batch Task Management ---
    # ===================================================================

    async def start_batch_translation(
        self,
        batch_id: str,
        payload: TranslatePayload,
        files: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Start a batch translation task.

        Args:
            batch_id: Unique batch identifier
            payload: Translation parameters (shared for all files)
            files: List of files with 'filename' and 'content' keys

        Returns:
            Response dict with batch_id and task_ids
        """
        task_ids = []

        # Initialize batch state
        self.batch_tasks_state[batch_id] = {
            "task_ids": [],
            "started_at": time.time(),
            "total_files": len(files),
            "payload": payload,
        }

        # Start each file as a separate task
        for file_info in files:
            task_id = uuid.uuid4().hex[:8]
            try:
                await self.start_translation(
                    task_id=task_id,
                    payload=payload,
                    file_contents=file_info["content"],
                    original_filename=file_info["filename"],
                )
                task_ids.append(task_id)
            except Exception as e:
                print(f"[Batch {batch_id}] Failed to start task for {file_info['filename']}: {e}")

        self.batch_tasks_state[batch_id]["task_ids"] = task_ids

        return {
            "batch_started": True,
            "batch_id": batch_id,
            "task_ids": task_ids,
            "message": f"批量翻译任务已启动，共 {len(task_ids)} 个文件",
        }

    def get_batch_state(self, batch_id: str) -> Optional[Dict[str, Any]]:
        """Get batch task state by ID."""
        batch_state = self.batch_tasks_state.get(batch_id)
        if not batch_state:
            return None

        task_ids = batch_state["task_ids"]
        completed_count = 0
        error_count = 0
        processing_count = 0

        tasks_info = []
        for task_id in task_ids:
            task_state = self.get_task_state(task_id)
            if task_state:
                tasks_info.append({
                    "task_id": task_id,
                    "filename": task_state.get("original_filename", ""),
                    "is_processing": task_state.get("is_processing", False),
                    "download_ready": task_state.get("download_ready", False),
                    "error_flag": task_state.get("error_flag", False),
                    "progress_percent": task_state.get("progress_percent", 0),
                    "status_message": task_state.get("status_message", ""),
                })

                if task_state.get("download_ready"):
                    completed_count += 1
                elif task_state.get("error_flag"):
                    error_count += 1
                elif task_state.get("is_processing"):
                    processing_count += 1

        total_count = len(task_ids)
        overall_progress = int((completed_count + error_count) / total_count * 100) if total_count > 0 else 0
        all_completed = completed_count + error_count == total_count

        return {
            "batch_id": batch_id,
            "total_files": total_count,
            "completed_count": completed_count,
            "error_count": error_count,
            "processing_count": processing_count,
            "overall_progress": overall_progress,
            "all_completed": all_completed,
            "started_at": batch_state["started_at"],
            "tasks": tasks_info,
        }

    def list_batches(self) -> List[Dict[str, Any]]:
        """List all batch tasks with summary information."""
        batches_list = []

        for batch_id, batch_state in self.batch_tasks_state.items():
            task_ids = batch_state.get("task_ids", [])
            if not task_ids:
                continue

            completed_count = 0
            error_count = 0
            processing_count = 0

            for task_id in task_ids:
                task_state = self.get_task_state(task_id)
                if task_state:
                    if task_state.get("download_ready"):
                        completed_count += 1
                    elif task_state.get("error_flag"):
                        error_count += 1
                    elif task_state.get("is_processing"):
                        processing_count += 1

            total_count = len(task_ids)
            overall_progress = int((completed_count + error_count) / total_count * 100) if total_count > 0 else 0
            all_completed = completed_count + error_count == total_count

            if all_completed:
                status = "completed" if error_count == 0 else "partial"
            elif processing_count > 0:
                status = "processing"
            else:
                status = "failed"

            batches_list.append({
                "batch_id": batch_id,
                "status": status,
                "total_files": total_count,
                "completed_files": completed_count,
                "failed_files": error_count,
                "processing_files": processing_count,
                "overall_progress": overall_progress,
                "started_at": batch_state.get("started_at", 0),
            })

        batches_list.sort(key=lambda x: x["started_at"], reverse=True)
        return batches_list

    async def get_batch_zip(self, batch_id: str) -> Optional[bytes]:
        """
        Get all completed files from a batch as a ZIP archive.

        Args:
            batch_id: Batch ID

        Returns:
            ZIP file content as bytes, or None if batch not found
        """
        batch_state = self.batch_tasks_state.get(batch_id)
        if not batch_state:
            return None

        import zipfile
        from io import BytesIO

        zip_buffer = BytesIO()

        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for task_id in batch_state["task_ids"]:
                task_state = self.get_task_state(task_id)
                if task_state and task_state.get("download_ready"):
                    downloadable_files = task_state.get("downloadable_files", {})
                    # Get the first available format for each task
                    for file_type, file_info in downloadable_files.items():
                        file_path = file_info.get("path")
                        filename = file_info.get("filename")
                        if file_path and os.path.exists(file_path):
                            try:
                                with open(file_path, 'rb') as f:
                                    zipf.writestr(filename, f.read())
                                break  # Only add one format per file
                            except Exception as e:
                                print(f"[Batch {batch_id}] Failed to add {filename} to ZIP: {e}")

        zip_buffer.seek(0)
        return zip_buffer.getvalue()

    async def get_batch_zip_with_formats(self, batch_id: str, formats: List[str], task_ids: Optional[List[str]] = None) -> Optional[bytes]:
        """
        Get completed files from a batch in specified formats as a ZIP archive.

        Args:
            batch_id: Batch ID
            formats: List of file types to include (e.g., ['markdown', 'docx', 'pdf'])
            task_ids: Optional list of task IDs (for single file downloads)

        Returns:
            ZIP file content as bytes, or None if batch not found
        """
        batch_state = self.batch_tasks_state.get(batch_id)
        if not batch_state:
            return None

        # For single file downloads, use provided task_ids instead of batch_state["task_ids"]
        task_ids_to_process = task_ids if task_ids else batch_state.get("task_ids", [])
        if not task_ids_to_process:
            return None

        # Get payload from batch state for filename generation
        batch_payload = batch_state.get("payload")

        import zipfile
        from io import BytesIO

        zip_buffer = BytesIO()

        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for task_id in task_ids_to_process:
                task_state = self.get_task_state(task_id)
                if task_state and task_state.get("download_ready"):
                    downloadable_files = task_state.get("downloadable_files", {})
                    filename_stem = task_state.get("original_filename_stem", task_id)

                    # Add requested formats
                    for file_type in formats:
                        if file_type == "pdf":
                            # 优先使用已生成的PDF，使用batch payload格式化文件名
                            if "pdf" in downloadable_files:
                                file_info = downloadable_files["pdf"]
                                pdf_path = file_info.get("path")
                                if pdf_path and os.path.exists(pdf_path):
                                    # 使用batch payload来生成正确的文件名
                                    pdf_filename = self._format_filename(filename_stem, ".pdf", batch_payload)
                                    with open(pdf_path, 'rb') as f:
                                        zipf.writestr(pdf_filename, f.read())
                            else:
                                # 回退：动态生成PDF，使用配置的文件名
                                pdf_content = await self._generate_pdf_for_task(task_id, task_state)
                                if pdf_content:
                                    # 使用batch payload来生成正确的文件名
                                    pdf_filename = self._format_filename(filename_stem, ".pdf", batch_payload)
                                    zipf.writestr(pdf_filename, pdf_content)
                        elif file_type in downloadable_files:
                            # Get existing file and use payload to format filename
                            file_info = downloadable_files[file_type]
                            file_path = file_info.get("path")
                            if file_path and os.path.exists(file_path):
                                try:
                                    # 使用batch payload重新格式化文件名，确保前缀和后缀正确
                                    ext = f".{file_type}" if file_type != "markdown_zip" else ".zip"
                                    formatted_filename = self._format_filename(filename_stem, ext, batch_payload)
                                    with open(file_path, 'rb') as f:
                                        zipf.writestr(formatted_filename, f.read())
                                except Exception as e:
                                    print(f"[Batch {batch_id}] Failed to add file to ZIP: {e}")

        zip_buffer.seek(0)
        return zip_buffer.getvalue()

    def get_single_file_content(self, task_id: str, file_format: str) -> Optional[Dict[str, Any]]:
        """
        Get single file content for direct download (not ZIP).

        Args:
            task_id: Task ID
            file_format: File format to download (e.g., 'markdown', 'docx', 'pdf')

        Returns:
            Dictionary with 'content' (bytes), 'filename' (str), 'media_type' (str), or None if not found
        """
        task_state = self.get_task_state(task_id)
        if not task_state or not task_state.get("download_ready"):
            return None

        downloadable_files = task_state.get("downloadable_files", {})
        filename_stem = task_state.get("original_filename_stem", task_id)
        payload = task_state.get("payload")

        # Map file format to media type
        media_types = {
            "markdown": "text/markdown",
            "md": "text/markdown",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "pdf": "application/pdf",
            "html": "text/html",
            "txt": "text/plain",
        }

        if file_format == "pdf":
            # Check if PDF is already generated
            if "pdf" in downloadable_files:
                file_info = downloadable_files["pdf"]
                pdf_path = file_info.get("path")
                if pdf_path and os.path.exists(pdf_path):
                    # Use payload to format filename with correct prefix/suffix
                    filename = self._format_filename(filename_stem, ".pdf", payload)
                    with open(pdf_path, 'rb') as f:
                        return {
                            "content": f.read(),
                            "filename": filename,
                            "media_type": media_types.get("pdf", "application/pdf"),
                        }
        elif file_format in downloadable_files:
            file_info = downloadable_files[file_format]
            file_path = file_info.get("path")
            if file_path and os.path.exists(file_path):
                # Use payload to format filename with correct prefix/suffix
                ext = f".{file_format}" if file_format != "markdown_zip" else ".zip"
                filename = self._format_filename(filename_stem, ext, payload)
                with open(file_path, 'rb') as f:
                    return {
                        "content": f.read(),
                        "filename": filename,
                        "media_type": media_types.get(file_format, "application/octet-stream"),
                    }

        return None

    async def _generate_pdf_for_task(self, task_id: str, task_state: Dict[str, Any]) -> Optional[bytes]:
        """
        Generate PDF for a task from HTML or Markdown.

        Args:
            task_id: Task ID
            task_state: Task state dictionary

        Returns:
            PDF content as bytes, or None if generation fails
        """
        downloadable_files = task_state.get("downloadable_files", {})

        # Try HTML first
        if "html" in downloadable_files:
            html_path = downloadable_files["html"]["path"]
            if os.path.exists(html_path):
                return await self._html_to_pdf(html_path)

        # Try Markdown as fallback
        if "markdown" in downloadable_files:
            md_path = downloadable_files["markdown"]["path"]
            if os.path.exists(md_path):
                return await self._markdown_to_pdf(md_path)

        return None

    def _ensure_playwright_browsers(self) -> bool:
        """确保Playwright浏览器已安装。"""
        if self._playwright_browsers_installed:
            return True

        try:
            import subprocess
            import sys

            print("正在安装Playwright浏览器（Chromium）...")
            result = subprocess.run(
                [sys.executable, "-m", "playwright", "install", "chromium"],
                capture_output=True,
                text=True,
                timeout=300  # 5分钟超时
            )

            if result.returncode == 0:
                self._playwright_browsers_installed = True
                print("Playwright浏览器安装成功")
                return True
            else:
                print(f"Playwright浏览器安装失败: {result.stderr}")
                return False
        except subprocess.TimeoutExpired:
            print("Playwright浏览器安装超时")
            return False
        except Exception as e:
            print(f"安装Playwright浏览器时出错: {e}")
            return False

    async def _html_to_pdf(self, html_path: str) -> Optional[bytes]:
        """
        Convert HTML to PDF using Playwright.

        Args:
            html_path: Path to HTML file

        Returns:
            PDF content as bytes, or None if conversion fails
        """
        # 确保浏览器已安装
        if not self._ensure_playwright_browsers():
            print("无法安装Playwright浏览器，PDF生成失败")
            return None

        try:
            from playwright.async_api import async_playwright

            async with async_playwright() as p:
                browser = await p.chromium.launch()
                page = await browser.new_page()

                # Load HTML file
                file_url = "file://" + html_path.replace(os.sep, '/')
                await page.goto(file_url)

                # Generate PDF
                pdf_bytes = await page.pdf(
                    format="A4",
                    margin={"top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm"},
                    print_background=True
                )

                await browser.close()
                return pdf_bytes
        except ImportError:
            print("playwright未安装，PDF生成失败")
            return None
        except Exception as e:
            print(f"HTML到PDF转换失败: {e}")
            return None

    async def _markdown_to_pdf(self, md_path: str) -> Optional[bytes]:
        """
        Convert Markdown to PDF using Playwright.

        Args:
            md_path: Path to Markdown file

        Returns:
            PDF content as bytes, or None if conversion fails
        """
        # 确保浏览器已安装
        if not self._ensure_playwright_browsers():
            print("无法安装Playwright浏览器，PDF生成失败")
            return None

        try:
            import markdown
            from playwright.async_api import async_playwright

            # Read Markdown file
            with open(md_path, 'r', encoding='utf-8') as f:
                md_content = f.read()

            # Convert Markdown to HTML
            html_content = markdown.markdown(
                md_content,
                extensions=['tables', 'fenced_code', 'codehilite']
            )

            # Wrap in basic HTML template
            full_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }}
                    h1 {{ color: #333; margin-top: 30px; margin-bottom: 15px; }}
                    h2 {{ color: #444; margin-top: 25px; margin-bottom: 12px; }}
                    h3 {{ color: #555; margin-top: 20px; margin-bottom: 10px; }}
                    pre {{ background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }}
                    code {{ font-family: Consolas, Monaco, monospace; background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }}
                    blockquote {{ border-left: 4px solid #ddd; padding-left: 15px; color: #666; }}
                    table {{ border-collapse: collapse; width: 100%; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; }}
                    th {{ background: #f5f5f5; }}
                </style>
            </head>
            <body>{html_content}</body>
            </html>
            """

            async with async_playwright() as p:
                browser = await p.chromium.launch()
                page = await browser.new_page()

                # Load HTML content
                await page.set_content(full_html)

                # Generate PDF
                pdf_bytes = await page.pdf(
                    format="A4",
                    margin={"top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm"},
                    print_background=True
                )

                await browser.close()
                return pdf_bytes
        except Exception as e:
            print(f"Markdown到PDF转换失败: {e}")
            return None

    def get_file_content(self, task_id: str) -> Optional[Dict[str, str]]:
        """
        Get original and translated content for preview.

        Args:
            task_id: Task ID

        Returns:
            Dictionary with 'original' and 'translated' content, or None if not found
        """
        task_state = self.get_task_state(task_id)
        if not task_state:
            return None

        downloadable_files = task_state.get("downloadable_files", {})
        result = {"original": "", "translated": ""}

        # Get original content (from markdown if available)
        if "markdown" in downloadable_files:
            original_path = downloadable_files["markdown"].get("path")
            if original_path and os.path.exists(original_path):
                with open(original_path, 'r', encoding='utf-8') as f:
                    result["original"] = f.read()

        # Try to find translated content (from html or translated markdown)
        if "html" in downloadable_files:
            html_path = downloadable_files["html"].get("path")
            if html_path and os.path.exists(html_path):
                with open(html_path, 'r', encoding='utf-8') as f:
                    result["translated"] = f.read()
        elif "markdown" in downloadable_files:
            # Fallback: use same content for both (original file)
            md_path = downloadable_files["markdown"].get("path")
            if md_path and os.path.exists(md_path):
                with open(md_path, 'r', encoding='utf-8') as f:
                    result["translated"] = f.read()

        return result

    async def get_pdf_preview_content(self, task_id: str) -> Optional[Dict[str, Any]]:
        """
        获取原文PDF和译文PDF用于预览。

        Args:
            task_id: Task ID

        Returns:
            Dictionary with 'original_pdf' and 'translated_pdf' as base64 strings
        """
        import base64

        task_state = self.get_task_state(task_id)
        if not task_state:
            return None

        result = {"original_pdf": None, "translated_pdf": None}
        downloadable_files = task_state.get("downloadable_files", {})

        # 获取译文PDF（优先使用已生成的PDF）
        if "pdf" in downloadable_files:
            pdf_path = downloadable_files["pdf"].get("path")
            if pdf_path and os.path.exists(pdf_path):
                with open(pdf_path, 'rb') as f:
                    pdf_bytes = f.read()
                    result["translated_pdf"] = base64.b64encode(pdf_bytes).decode("utf-8")
        # 回退：从HTML或Markdown动态生成
        elif "html" in downloadable_files:
            html_path = downloadable_files["html"].get("path")
            if html_path and os.path.exists(html_path):
                pdf_bytes = await self._html_to_pdf(html_path)
                if pdf_bytes:
                    result["translated_pdf"] = base64.b64encode(pdf_bytes).decode("utf-8")
        elif "markdown" in downloadable_files:
            md_path = downloadable_files["markdown"].get("path")
            if md_path and os.path.exists(md_path):
                pdf_bytes = await self._markdown_to_pdf(md_path)
                if pdf_bytes:
                    result["translated_pdf"] = base64.b64encode(pdf_bytes).decode("utf-8")

        # 获取原文PDF（如果原始文件是PDF）
        original_file_path = task_state.get("original_file_path")
        if original_file_path and os.path.exists(original_file_path):
            # 检查是否为PDF文件
            if original_file_path.lower().endswith('.pdf'):
                with open(original_file_path, 'rb') as f:
                    pdf_bytes = f.read()
                    result["original_pdf"] = base64.b64encode(pdf_bytes).decode("utf-8")

        return result

    async def release_batch(self, batch_id: str) -> Dict[str, Any]:
        """Release all resources for a batch task."""
        batch_state = self.batch_tasks_state.get(batch_id)
        if not batch_state:
            return {"released": False, "message": f"找不到批量任务ID '{batch_id}'"}

        # Release all individual tasks
        for task_id in batch_state["task_ids"]:
            try:
                await self.release_task(task_id)
            except Exception as e:
                print(f"[Batch {batch_id}] Failed to release task {task_id}: {e}")

        # Remove batch state
        self.batch_tasks_state.pop(batch_id, None)

        return {"released": True, "message": f"批量任务 '{batch_id}' 的资源已释放"}


# Global singleton instance
_translation_service: Optional[TranslationService] = None


def get_translation_service() -> TranslationService:
    """Get the global translation service instance (singleton)."""
    global _translation_service
    if _translation_service is None:
        _translation_service = TranslationService()
    return _translation_service
