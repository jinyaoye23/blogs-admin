@echo off
echo ========================================
echo   删除博客后端 API 防火墙规则
echo ========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] 请以管理员身份运行此脚本!
    pause
    exit /b 1
)

echo [信息] 正在删除防火墙规则...
echo.

netsh advfirewall firewall delete rule name="Node.js Blog API Port 3000"

if %errorLevel% equ 0 (
    echo.
    echo [成功] 防火墙规则已删除!
    echo.
) else (
    echo.
    echo [提示] 未找到该规则或删除失败
    echo.
)

pause
