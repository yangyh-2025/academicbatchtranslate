# SPDX-FileCopyrightText: 2025 QinHan
# SPDX-FileCopyrightText: 2025 YangYuhang
# SPDX-License-Identifier: MPL-2.0
from dataclasses import dataclass

from academicbatchtranslate.exporter.base import Exporter, ExporterConfig
from academicbatchtranslate.ir.document import Document
from academicbatchtranslate.ir.markdown_document import MarkdownDocument


@dataclass(kw_only=True)
class MDExporterConfig(ExporterConfig):
    ...


class MDExporter(Exporter):
    def __init__(self, config: MDExporterConfig|None=None):
        super().__init__(config=config)

    def export(self, document: MarkdownDocument) -> Document:
        ...
