#!/bin/bash
# 阿里云服务器初始化脚本

# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安装PM2进程管理器
sudo npm install -g pm2

# 4. 安装MongoDB 6.0
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 5. 启动MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. 安装Nginx
sudo apt install -y nginx

# 7. 安装Git
sudo apt install -y git

# 8. 创建应用目录
sudo mkdir -p /var/www/vue-app
sudo chown -R $USER:$USER /var/www/vue-app

# 9. 配置防火墙
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# 10. 安装其他必要工具
sudo apt install -y curl wget vim htop

echo "✅ 服务器环境初始化完成！"
echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo "MongoDB状态: $(sudo systemctl is-active mongod)"
