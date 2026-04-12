# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.srt.base import SrtExporter
from academicbatchtranslate.ir.document import Document


class Srt2SrtExporter(SrtExporter):
    def export(self, document: Document) -> Document:
        return document.copy()
