# SPDX-FileCopyrightText: 2025 yangyh-2025
# SPDX-License-Identifier: MPL-2.0
# -*- coding: utf-8 -*-
"""
AcademicBatchTranslateOne-click startup script
Automatically handles: installing dependencies, building frontend, starting service
"""

import os
import sys
import subprocess
from pathlib import Path


def check_and_install_python_deps():
    """检查并安装 Python 依赖"""
    print("📦 检查 Python 依赖...")

    required_packages = ["fastapi", "uvicorn", "httpx"]

    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} 未安装")
            print(f"  🔧 正在安装 {package}...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", package
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print(f"  ✅ {package} 安装完成")


def check_and_install_playwright():
    """检查并安装Playwright浏览器"""
    print("\n📦 检查 Playwright 浏览器...")

    try:
        from playwright.sync_api import sync_playwright

        # 尝试启动浏览器来检查是否已安装
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                browser.close()
            print("  ✅ Playwright 浏览器已安装")
            return True
        except Exception:
            # 浏览器未安装，提示用户手动安装
            print("  ⚠️  Playwright 浏览器未安装")
            print("  💡 请手动运行以下命令安装浏览器：")
            print(f"     {sys.executable} -m playwright install chromium")
            print("  ℹ️  安装后 PDF 下载功能将可用")
            return False
    except ImportError:
        print("  ⚠️  playwright 未安装，PDF 功能将不可用")
        print("  💡 如需 PDF 功能，请运行: pip install playwright")
        return False


def check_and_install_frontend_deps():
    """检查并安装前端依赖"""
    frontend_dir = Path("frontend")

    if not frontend_dir.exists():
        print("❌ 前端目录不存在！")
        return False

    print("\n📦 检查前端依赖...")

    # 检查 node_modules 是否存在
    node_modules = frontend_dir / "node_modules"
    needs_install = not node_modules.exists()

    if needs_install:
        print("🔧 正在安装前端依赖（首次运行需要几分钟）...")
        try:
            result = subprocess.run(
                ["npm", "install"],
                cwd=frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=300  # 5分钟超时
            )

            if result.returncode != 0:
                print(f"❌ npm install 失败！")
                print(result.stderr)
                return False
            else:
                print("✅ 前端依赖安装完成！")
        except subprocess.TimeoutExpired:
            print("⏱️ npm install 超时，请手动运行：cd frontend && npm install")
            return False
        except Exception as e:
            print(f"❌ 安装出错：{e}")
            return False
    else:
        print("✅ 前端依赖已存在！")

    return True


def build_frontend():
    """构建前端"""
    frontend_dir = Path("frontend")
    dist_dir = frontend_dir / "dist"

    # 检查构建产物是否已存在
    if dist_dir.exists() and (dist_dir / "index.html").exists():
        print("\n✅ 前端构建产物已存在，跳过构建")
        print(f"   📁 {dist_dir}")
        return True

    print("\n🔨 构建前端...")

    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=180  # 3分钟超时
        )

        if result.returncode != 0:
            print(f"❌ 前端构建失败！")
            print(result.stderr)
            return False
        else:
            print("✅ 前端构建完成！")
            return True
    except FileNotFoundError:
        print("❌ 找不到 npm 命令！")
        print("   请确保已安装 Node.js 和 npm，并将其添加到系统 PATH 中")
        print("   或者，如果构建产物已存在，可以直接启动后端")
        return False
    except subprocess.TimeoutExpired:
        print("⏱️ 构建超时，请手动运行：cd frontend && npm run build")
        return False
    except Exception as e:
        print(f"❌ 构建出错：{e}")
        return False


def start_backend():
    """启动后端服务"""
    print("\n🚀 启动后端服务...")

    try:
        # 切虚环境并运行
        if os.name == 'nt':  # Windows
            venv_python = Path(".venv/Scripts/python.exe")
        else:  # Linux/Mac
            venv_python = Path(".venv/bin/python")

        if not venv_python.exists():
            print("❌ 虚拟环境不存在！")
            print("请先创建虚拟环境：python -m venv .venv")
            return False

        # 导入 run_app 函数并调用（启用 CORS）
        from academicbatchtranslate.app import run_app

        print("=" * 60)
        print(f"✨ 服务将在以下地址启动：")
        print(f"   🌐 主页面: http://localhost:8010")
        print(f"   📝 前端应用: http://localhost:8010/app")
        print(f"   📚 API 文档: http://localhost:8010/docs")
        print("=" * 60)
        print("已启用跨域支持 (CORS)")
        print("按 Ctrl+C 停止服务")
        print()

        run_app(host="0.0.0.0", port=8010, enable_CORS=True, with_mcp=False)

    except KeyboardInterrupt:
        print("\n\n⏸️ 服务已停止")
        sys.exit(0)
    except Exception as e:
        print(f"❌ 启动服务失败：{e}")
        sys.exit(1)


def main():
    """主函数"""
    print("=" * 60)
    print("  🚀 AcademicBatchTranslate 一键启动脚本  ".center(60))
    print("=" * 60)
    print()

    # 步骤 1: 检查并安装 Python 依赖
    check_and_install_python_deps()

    # 步骤 2: 检查并安装 Playwright 浏览器
    check_and_install_playwright()

    # 步骤 3: 检查并安装前端依赖
    if not check_and_install_frontend_deps():
        print("\n❌ 前端依赖安装失败，无法继续")
        sys.exit(1)

    # 步骤 4: 构建前端
    if not build_frontend():
        print("\n❌ 前端构建失败，无法继续")
        sys.exit(1)

    # 步骤 5: 启动后端
    start_backend()


if __name__ == "__main__":
    main()
