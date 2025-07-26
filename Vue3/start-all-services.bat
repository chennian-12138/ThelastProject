@echo off
echo 🚀 启动文献助手系统...
echo.

:: 设置窗口标题
title 文献助手系统 - 启动器

:: 检查端口占用
echo 🔍 检查端口占用...
netstat -ano | findstr :5173 >nul && echo ❌ 端口5173被占用 || echo ✅ 端口5173可用
netstat -ano | findstr :3000 >nul && echo ❌ 端口3000被占用 || echo ✅ 端口3000可用
netstat -ano | findstr :3001 >nul && echo ❌ 端口3001被占用 || echo ✅ 端口3001可用
netstat -ano | findstr :11434 >nul && echo ❌ 端口11434被占用 || echo ✅ 端口11434可用
echo.

:: 启动MongoDB
echo 📊 启动MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB服务未找到，请手动启动
) else (
    echo ✅ MongoDB已启动
)
timeout /t 3 /nobreak >nul

:: 启动Ollama（需要手动确认）
echo 🤖 检查Ollama...
tasklist /FI "IMAGENAME eq ollama.exe" 2>nul | find /I /N "ollama.exe" >nul
if %errorlevel% neq 0 (
    echo ⚠️  请手动启动Ollama: 打开新的命令窗口运行 "ollama serve"
    echo    然后按任意键继续...
    pause >nul
) else (
    echo ✅ Ollama已在运行
)

:: 启动后端
echo 🖥️  启动后端服务...
cd backend
if not exist ".env" (
    echo 创建.env文件...
    echo NODE_ENV=development > .env
    echo PORT=3000 >> .env
    echo MONGO_URI=mongodb://localhost:27017/vue_papers >> .env
    echo JWT_SECRET=dev-secret-key-change-in-production >> .env
    echo CORS_ORIGIN=http://localhost:5173 >> .env
)
start cmd /k "npm run backend"
cd ..

:: 启动文献服务
echo 📚 启动文献服务...
cd scripts
start cmd /k "conda activate vue_papers && python -m uvicorn semantic_search:app --reload --port 3001"
cd ..

:: 启动前端
echo 🎨 启动前端服务...
start cmd /k "npm run dev"

:: 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 5 /nobreak >nul

echo.
echo 🎉 服务启动完成！
echo.
echo 📋 服务地址：
echo 前端: http://localhost:5173
echo 后端: http://localhost:3000
echo 文献: http://localhost:3001
echo AI:   http://localhost:11434
echo.
echo 🔧 提示：
echo - 如果MongoDB未启动，请手动运行 "mongod"
echo - 如果Ollama未启动，请手动运行 "ollama serve"
echo - 按任意键关闭此窗口，服务会继续在后台运行
pause >nul
