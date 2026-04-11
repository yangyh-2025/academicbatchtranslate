# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.txt.base import TXTExporter
from academicbatchtranslate.ir.document import Document


class TXT2TXTExporter(TXTExporter):
    def export(self, document: Document) -> Document:
        return document.copy()
