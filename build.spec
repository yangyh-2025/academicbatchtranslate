# -*- mode: python ; coding: utf-8 -*-
import sys
from pathlib import Path

block_cipher = None

# 获取项目根目录
project_root = Path(__file__).parent

# 收集所有数据目录
datas = [
    # 静态文件
    (str(project_root / "academicbatchtranslate" / "static"), "academicbatchtranslate/static"),
    (str(project_root / "academicbatchtranslate" / "template"), "academicbatchtranslate/template"),
    # 前端构建产物
    (str(project_root / "frontend" / "dist"), "frontend/dist"),
]

# 收集隐式导入
hiddenimports = [
    'academicbatchtranslate',
    'academicbatchtranslate.app',
    'academicbatchtranslate.sdk',
    'academicbatchtranslate.server',
    'academicbatchtranslate.converter',
    'academicbatchtranslate.translator',
    'academicbatchtranslate.exporter',
    'academicbatchtranslate.workflow',
    'academicbatchtranslate.agents',
    'academicbatchtranslate.global_values',
    'academicbatchtranslate.logger',
    'academicbatchtranslate.ir',
    'academicbatchtranslate.cacher',
    'academicbatchtranslate.glossary',
    'academicbatchtranslate.progress',
    'academicbatchtranslate.context',
    'academicbatchtranslate.mcp',
    'academicbatchtranslate.utils',
    'uvicorn',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.loops',
    'uvicorn.lifespan',
    'fastapi',
    'fastapi.middleware.cors',
    'pydantic',
    'httpx',
    'openpyxl',
    'mammoth',
    'pysubs2',
    'python_pptx',
    'beautifulsoup4',
    'markdown',
    'pypdf',
    'xlsx2html',
    'srt',
]

a = Analysis(
    [str(project_root / "academicbatchtranslate" / "app.py")],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='AcademicBatchTranslate',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,  # 显示控制台，方便查看日志
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # 可以添加图标文件路径
)
