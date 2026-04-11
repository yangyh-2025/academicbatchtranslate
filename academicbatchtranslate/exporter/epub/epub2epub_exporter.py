# SPDX-License-Identifier: MPL-2.0

from academicbatchtranslate.exporter.txt.base import TXTExporter
from academicbatchtranslate.exporter.xlsx.base import XlsxExporter
from academicbatchtranslate.ir.document import Document


class Epub2EpubExporter(XlsxExporter):
    def export(self, document: Document) -> Document:
        return document.copy()
