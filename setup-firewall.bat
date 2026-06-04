@echo off
echo ========================================
echo   配置博客后端 API 防火墙规则
echo ========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] 请以管理员身份运行此脚本!
    echo.
    echo 使用方法:
    echo 1. 右键点击此文件
    echo 2. 选择 "以管理员身份运行"
    pause
    exit /b 1
)

echo [信息] 正在添加防火墙规则...
echo.

REM 删除旧规则(如果存在)
netsh advfirewall firewall delete rule name="Node.js Blog API Port 3000" >nul 2>&1

REM 添加新规则
netsh advfirewall firewall add rule name="Node.js Blog API Port 3000" dir=in action=allow protocol=TCP localport=3000

if %errorLevel% equ 0 (
    echo.
    echo [成功] 防火墙规则已添加!
    echo.
    echo 现在可以从其他设备访问:
    echo http://192.168.0.101:3000
    echo.
) else (
    echo.
    echo [失败] 添加防火墙规则失败!
    echo.
)

pause
