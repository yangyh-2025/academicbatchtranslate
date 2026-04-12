# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.exporter.md.base import MDExporter
from academicbatchtranslate.ir.markdown_document import MarkdownDocument, Document
from academicbatchtranslate.utils.markdown_utils import unembed_base64_images_to_zip


class MD2MDZipExporter(MDExporter):

    def export(self, document: MarkdownDocument) -> Document:
        return Document.from_bytes(suffix=".zip", content=unembed_base64_images_to_zip(document.content.decode(),
                                                                                       markdown_name=document.name),
                                   stem=document.stem)
