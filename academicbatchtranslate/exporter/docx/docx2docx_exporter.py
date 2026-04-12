# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0

from academicbatchtranslate.exporter.docx.base import DocxExporter
from academicbatchtranslate.ir.document import Document


class Docx2DocxExporter(DocxExporter):
    def export(self, document: Document) -> Document:
        return document.copy()
