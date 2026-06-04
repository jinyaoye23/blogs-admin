@echo off
chcp 65001 >nul
echo ========================================
echo   API 测试脚本 - 自动登录并获取数据
echo ========================================
echo.

REM 配置
set BASE_URL=http://localhost:3000
set EMAIL=admin@example.com
set PASSWORD=123456

echo [1/3] 正在登录...
echo.

REM 登录获取 token
for /f "tokens=*" %%a in ('curl -s -X POST %BASE_URL%/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}"') do set LOGIN_RESPONSE=%%a

echo 登录响应: %LOGIN_RESPONSE%
echo.

REM 简单提取 token (假设响应中包含 token)
echo %LOGIN_RESPONSE% | findstr "token" >nul
if errorlevel 1 (
    echo [错误] 登录失败，请检查邮箱和密码
    pause
    exit /b 1
)

echo [成功] 登录成功！
echo.
echo [2/3] 正在获取用户列表...
echo.

REM 这里需要你手动输入 token，因为批处理解析 JSON 比较复杂
echo 请从上面的响应中复制 token 值
echo.
set /p TOKEN="请输入 Token: "

echo.
echo [3/3] 正在获取用户数据...
echo.

curl -X GET "%BASE_URL%/api/users?page=1^&limit=10^&keyword=" ^
  -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo ========================================
echo   测试完成
echo ========================================
pause
