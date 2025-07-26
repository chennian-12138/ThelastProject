# Windows用户阿里云部署指南

## 🖥️ Windows用户专用部署流程

### 1. 使用Windows工具连接阿里云

#### 推荐工具：
- **SSH客户端**: PuTTY 或 Windows Terminal
- **文件传输**: WinSCP 或 FileZilla
- **代码编辑**: VS Code 远程SSH

#### 安装PuTTY：
1. 下载：https://www.putty.org/
2. 安装并配置SSH密钥

### 2. Windows下的部署步骤

#### 步骤1：购买阿里云ECS
- 登录阿里云控制台
- 选择ECS实例：Ubuntu 22.04 LTS
- 记住公网IP地址

#### 步骤2：使用PuTTY连接服务器
```bash
# 在PuTTY中输入
Host: your-server-ip
Port: 22
Username: root
```

#### 步骤3：一键部署（复制粘贴到PuTTY）

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安装PM2
sudo npm install -g pm2

# 4. 安装MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 5. 启动MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. 安装Nginx
sudo apt install -y nginx

# 7. 创建目录
sudo mkdir -p /var/www/vue-app
sudo chown -R $USER:$USER /var/www/vue-app
```

#### 步骤4：使用WinSCP上传文件
1. 下载WinSCP：https://winscp.net/
2. 连接到服务器
3. 上传项目文件到 `/var/www/vue-app/`

#### 步骤5：配置项目
```bash
# 在服务器上执行
cd /var/www/vue-app

# 安装依赖
npm install
cd backend && npm install --production && cd ..

# 构建前端
npm run build

# 复制文件
cp -r dist/* /var/www/vue-app/frontend/
cp -r backend/* /var/www/vue-app/backend/

# 创建环境变量文件
nano /var/www/vue-app/backend/.env
```

#### 步骤6：创建Windows批处理文件
创建 `deploy-windows.bat` 用于本地构建：

```batch
@echo off
echo 开始构建Vue3项目...

echo 安装依赖...
npm install

echo 构建前端...
npm run build

echo 构建后端...
cd backend
npm install --production
cd ..

echo 构建完成！
echo 请使用WinSCP上传以下文件到服务器：
echo - dist/ 目录到 /var/www/vue-app/frontend/
echo - backend/ 目录到 /var/www/vue-app/backend/
pause
```

### 3. Windows下的Nginx配置

#### 使用WinSCP编辑配置文件：
1. 连接到服务器
2. 导航到 `/etc/nginx/sites-available/`
3. 创建 `vue-app` 文件，内容如下：

```nginx
server {
    listen 80;
    server_name your-server-ip;  # 替换为你的IP或域名
    
    location / {
        root /var/www/vue-app/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Windows下的常用命令

#### 启动服务：
```bash
# 启动后端
pm2 start /var/www/vue-app/backend/app.js --name vue-app-backend

# 重启Nginx
sudo nginx -t && sudo systemctl restart nginx
```

#### 查看状态：
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs vue-app-backend

# 查看系统状态
sudo systemctl status nginx
sudo systemctl status mongod
```

### 5. Windows下的故障排除

#### 连接问题：
- 检查阿里云安全组
- 检查服务器防火墙：`sudo ufw status`
- 检查服务状态：`pm2 status`

#### 文件权限：
```bash
sudo chown -R www-data:www-data /var/www/vue-app
sudo chmod -R 755 /var/www/vue-app
```

### 6. 一键部署脚本（Windows版）

创建 `deploy-windows.ps1`：

```powershell
# Windows PowerShell部署脚本
Write-Host "开始部署Vue3项目到阿里云..." -ForegroundColor Green

# 1. 构建项目
Write-Host "构建前端..." -ForegroundColor Yellow
npm install
npm run build

# 2. 构建后端
Write-Host "构建后端..." -ForegroundColor Yellow
Set-Location backend
npm install --production
Set-Location ..

# 3. 提示上传
Write-Host "构建完成！" -ForegroundColor Green
Write-Host "请使用WinSCP上传以下文件：" -ForegroundColor Yellow
Write-Host "- dist/ 目录到 /var/www/vue-app/frontend/" -ForegroundColor Cyan
Write-Host "- backend/ 目录到 /var/www/vue-app/backend/" -ForegroundColor Cyan
Write-Host "- 配置文件到 /var/www/vue-app/backend/.env" -ForegroundColor Cyan

# 4. 提供后续命令
Write-Host "上传完成后，在服务器上执行：" -ForegroundColor Green
Write-Host "cd /var/www/vue-app/backend && pm2 start app.js --name vue-app-backend" -ForegroundColor Yellow
Write-Host "sudo nginx -t && sudo systemctl restart nginx" -ForegroundColor Yellow
```

### 7. 使用VS Code远程开发

#### 安装Remote-SSH扩展：
1. 在VS Code中安装 "Remote - SSH" 扩展
2. 按F1，选择 "Remote-SSH: Connect to Host"
3. 输入：`root@your-server-ip`
4. 连接后直接编辑服务器文件

## 🎯 快速检查清单

### 部署前：
- [ ] 阿里云ECS已购买
- [ ] PuTTY/WinSCP已安装
- [ ] 项目能在本地正常运行
- [ ] 记住服务器IP地址

### 部署后：
- [ ] http://your-server-ip 能访问前端
- [ ] http://your-server-ip/api/health 返回健康状态
- [ ] 数据库连接正常
- [ ] 用户注册/登录功能正常

## 📞 技术支持
- 阿里云客服：400-80-13260
- Windows SSH问题：检查PuTTY配置
- 文件上传问题：检查WinSCP连接
