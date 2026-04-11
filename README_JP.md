<p align="center">
<img src="./DocuTranslate.png" alt="Project Logo" style="width: 150px">
</p>

<h1 align="center">DocuTranslate</h1>

<p align="center">
  <a href="https://github.com/yangyh-2025/document-translate"><img src="https://img.shields.io/badge/GitHub-yangyh--2025%2Fdocument--translate-blue?style=flat-square" alt="GitHub"></a>
  <a href="https://pypi.org/project/docutranslate/"><img src="https://img.shields.io/pypi/v/docutranslate?style=flat-square" alt="PyPI version"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white&style=flat-square" alt="Python Version"></a>
</p>

<p align="center">
  <a href="/README.md"><strong>English</strong></a> / <a href="/README_ZH.md"><strong>简体中文</strong></a> / <a href="/README_JP.md"><strong>日本語</strong></a> / <a href="/README_VI.md"><strong>Tiếng Việt</strong></a>
</p>

<p align="center">
  大規模言語モデルに基づく軽量ローカル文書翻訳ツール
</p>

## 機能

- ✅ **マルチフォーマットサポート**: `pdf`、`docx`、`xlsx`、`md`、`txt`、`json`、`epub`、`srt`、`ass` などを翻訳
- ✅ **自動用語集生成**: 用語アライメントのための自動用語集生成をサポート
- ✅ **PDF表、数式、コード認識**: PDF解析に `mineru`（オンラインまたはローカルデプロイ）を使用
- ✅ **JSON翻訳**: jsonpathを介してJSON内の翻訳する値を指定可能
- ✅ **Word/Excelフォーマット保持**: 元のフォーマットを保持したまま `docx`、`xlsx` ファイルを翻訳
- ✅ **マルチAIプラットフォームサポート**: カスタムプロンプトと高性能並列翻訳を備えたほとんどのAIプラットフォームをサポート
- ✅ **非同期サポート**: 高性能シナリオ向けに設計されたフル非同期サポート
- ✅ **LAN/マルチユーザーサポート**: ローカルネットワーク上での複数同時ユーザーをサポート
- ✅ **インタラクティブWeb UI**: すぐに使えるWeb UIとRESTful API
- ✅ **小規模、マルチプラットフォームポータブルビルド**: 40MB未満のWindowsおよびmacOSパッケージ

## クイックスタート

### pipの使用

```bash
# 基本インストール
pip install docutranslate

# MCP拡張のインストール
pip install docutranslate[mcp]

docutranslate -i
```

### gitの使用

```bash
git clone https://github.com/yangyh-2025/document-translate.git
cd docutranslate
uv sync --no-dev
```

## ドキュメント

**完全なドキュメントについては [README_ZH.md](./README_ZH.md) （中国語）を参照してください。**

## ライセンス

MPL-2.0

---

**作者**: yangyh-2025  
**メール**: yangyuhang2667@163.com  
**プロジェクト**: https://github.com/yangyh-2025/document-translate
