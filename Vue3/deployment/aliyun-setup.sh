#!/bin/bash
# 阿里云服务器初始化脚本 - 包含Ollama

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================"
echo "    阿里云服务器初始化脚本"
echo "    包含 Node.js + MongoDB + Nginx + Ollama"
echo "========================================"

# 1. 更新系统
echo -e "${YELLOW}[1/8] 更新系统...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. 安装Node.js 18.x
echo -e "${YELLOW}[2/8] 安装Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安装PM2进程管理器
echo -e "${YELLOW}[3/8] 安装PM2...${NC}"
sudo npm install -g pm2

# 4. 安装MongoDB 6.0
echo -e "${YELLOW}[4/8] 安装MongoDB...${NC}"
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 5. 启动MongoDB
echo -e "${YELLOW}[5/8] 启动MongoDB...${NC}"
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. 安装Nginx
echo -e "${YELLOW}[6/8] 安装Nginx...${NC}"
sudo apt install -y nginx

# 7. 安装Git和其他工具
echo -e "${YELLOW}[7/8] 安装工具...${NC}"
sudo apt install -y git curl wget vim htop

# 8. 安装Ollama
echo -e "${YELLOW}[8/8] 安装Ollama...${NC}"
curl -fsSL https://ollama.ai/install.sh | sh
sudo systemctl start ollama
sudo systemctl enable ollama

# 9. 创建应用目录
echo -e "${YELLOW}创建应用目录...${NC}"
sudo mkdir -p /var/www/vue-app
sudo chown -R $USER:$USER /var/www/vue-app

# 10. 配置防火墙
echo -e "${YELLOW}配置防火墙...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw allow 11434/tcp  # Ollama端口
sudo ufw --force enable

# 11. 下载Ollama模型
echo -e "${YELLOW}下载AI模型...${NC}"
sleep 5  # 等待Ollama服务启动
ollama pull deepseek-r1:7b
ollama pull nomic-embed-text

# 12. 验证安装
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}安装完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo
echo "服务状态："
echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo "MongoDB状态: $(sudo systemctl is-active mongod)"
echo "Nginx状态: $(sudo systemctl is-active nginx)"
echo "Ollama状态: $(sudo systemctl is-active ollama)"
echo
echo "已安装模型："
ollama list
echo
echo "下一步："
echo "1. 上传项目文件到 /var/www/vue-app/"
echo "2. 配置环境变量"
echo "3. 启动应用"
