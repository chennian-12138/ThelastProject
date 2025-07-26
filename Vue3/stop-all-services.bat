@echo off
echo 🛑 停止文献助手系统...
echo.

:: 停止Node.js进程
echo 🖥️  停止Node.js进程...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.exe 2>nul
taskkill /F /IM vite.exe 2>nul

:: 停止Python进程
echo 🐍 停止Python进程...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM uvicorn.exe 2>nul

:: 停止MongoDB（可选）
echo 📊 停止MongoDB...
net stop MongoDB 2>nul

:: 停止Ollama（可选）
echo 🤖 停止Ollama...
taskkill /F /IM ollama.exe 2>nul

echo.
echo ✅ 所有服务已停止！
echo 如需重新启动，请双击运行 start-all-services.bat
pause
