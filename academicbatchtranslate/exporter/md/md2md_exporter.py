# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.md.base import MDExporter
from academicbatchtranslate.ir.markdown_document import MarkdownDocument, Document


class MD2MDExporter(MDExporter):

    def export(self, document: MarkdownDocument) -> Document:
        return Document.from_bytes(suffix=".md", content=document.content, stem=document.stem)
