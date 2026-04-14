# SPDX-FileCopyrightText: 2025 QinHan
# SPDX-FileCopyrightText: 2025 YangYuhang
# SPDX-License-Identifier: MPL-2.0

from academicbatchtranslate.exporter.base import Exporter
from academicbatchtranslate.ir.document import Document

#TODO:看情况是否需要为json单独写一个document类型
class DocxExporter(Exporter[Document]):

    def export(self,document:Document)->Document:
        ...