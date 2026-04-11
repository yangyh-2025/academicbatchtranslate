# SPDX-License-Identifier: MPL-2.0

from academicbatchtranslate.converter.base import Converter
from academicbatchtranslate.ir.document import Document


class ConverterIdentity(Converter):

    def convert(self, document: Document) -> Document:
        return Document.from_bytes(content=document.content, suffix=document.suffix, stem=document.stem)

    async def convert_async(self, document: Document) -> Document:
        return Document.from_bytes(content=document.content, suffix=document.suffix, stem=document.stem)
