# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.ass.base import AssExporter
from academicbatchtranslate.ir.document import Document


class Ass2AssExporter(AssExporter):
    def export(self, document: Document) -> Document:
        return document.copy()
