@echo off
chcp 65001 >nul
echo ========================================
echo   AcademicBatchTranslate 启动中...
echo ========================================
echo.

call "%~dp0.venv\Scripts\activate.bat"

if errorlevel 1 (
    echo [错误] 无法激活虚拟环境，请确认 .venv 目录存在
    pause
    exit /b 1
)

echo [成功] 虚拟环境已激活
echo [信息] 启动 Web UI 服务...
echo.
echo 服务启动后，请在浏览器访问: http://127.0.0.1:8010
echo 按 Ctrl+C 可停止服务
echo.
echo ========================================
echo.

academicbatchtranslate -i

pause
