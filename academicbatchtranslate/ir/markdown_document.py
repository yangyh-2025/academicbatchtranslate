# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from academicbatchtranslate.ir.document import Document


class MarkdownDocument(Document):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        self.suffix=".md"