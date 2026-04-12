# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from dataclasses import dataclass

import jinja2

from academicbatchtranslate.exporter.base import ExporterConfig
from academicbatchtranslate.exporter.txt.base import TXTExporter
from academicbatchtranslate.ir.document import Document
from academicbatchtranslate.utils.resource_utils import resource_path


@dataclass
class TXT2HTMLExporterConfig(ExporterConfig):
    cdn: bool = True


class TXT2HTMLExporter(TXTExporter):
    def __init__(self, config: TXT2HTMLExporterConfig = None):
        config = config or TXT2HTMLExporterConfig()
        super().__init__(config=config)
        self.cdn = config.cdn

    def export(self, document: Document) -> Document:
        cdn = self.cdn
        html_template = resource_path("template/txt.html").read_text(encoding="utf-8")

        # language=html
        body=document.content.decode()
        render = jinja2.Template(html_template).render(
            title=document.stem,
            body=body,
        )
        return Document.from_bytes(content=render.encode("utf-8"), suffix=".html", stem=document.stem)
