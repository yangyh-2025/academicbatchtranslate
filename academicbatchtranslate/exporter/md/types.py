# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
from typing import Literal

ConvertEngineType = Literal["mineru", "docling", "identity","mineru_deploy"]

MD2DocxEngineType = Literal["python", "pandoc", "auto"] | None