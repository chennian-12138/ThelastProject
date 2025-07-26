@echo off
color 0A
title Vue3项目构建工具 - Windows版

echo ========================================
echo    Vue3项目阿里云部署构建工具
echo ========================================
echo.

echo [1/5] 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未安装Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)

echo [2/5] 安装前端依赖...
call npm install
if errorlevel 1 (
    echo 错误：前端依赖安装失败
    pause
    exit /b 1
)

echo [3/5] 构建前端...
call npm run build
if errorlevel 1 (
    echo 错误：前端构建失败
    pause
    exit /b 1
)

echo [4/5] 安装后端依赖...
cd backend
call npm install --production
if errorlevel 1 (
    echo 错误：后端依赖安装失败
    pause
    exit /b 1
)
cd ..

echo [5/5] 创建部署包...
if not exist "dist" (
    echo 错误：dist目录不存在，构建失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo        构建完成！
echo ========================================
echo.
echo 下一步操作：
echo 1. 使用WinSCP连接到你的阿里云服务器
echo 2. 上传 dist 目录到 /var/www/vue-app/frontend/
echo 3. 上传 backend 目录到 /var/www/vue-app/backend/
echo 4. 在服务器上执行以下命令：
echo    cd /var/www/vue-app/backend
echo    nano .env  # 配置环境变量
echo    pm2 start app.js --name vue-app-backend
echo    sudo nginx -t && sudo systemctl restart nginx
echo.
echo 服务器访问地址：http://your-server-ip
echo.
pause
