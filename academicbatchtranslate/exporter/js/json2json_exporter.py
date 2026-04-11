# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.txt.base import TXTExporter
from academicbatchtranslate.ir.document import Document


class Json2JsonExporter(TXTExporter):
    def export(self, document: Document) -> Document:
        return document.copy()
