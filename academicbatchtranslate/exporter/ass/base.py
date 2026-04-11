# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.base import Exporter
from academicbatchtranslate.ir.document import Document

#TODO:看情况是否需要为TXT单独写一个document类型
class AssExporter(Exporter[Document]):

    def export(self,document:Document)->Document:
        ...