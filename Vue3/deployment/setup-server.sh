#!/bin/bash
# 服务器初始化脚本 - 阿里云宝塔Linux
# 在服务器上运行此脚本来安装必要的软件

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# 检查是否以root权限运行
if [[ $EUID -ne 0 ]]; then
    error "请使用root权限运行此脚本: sudo ./setup-server.sh"
fi

log "开始初始化服务器..."

# 1. 更新系统
log "更新系统..."
yum update -y || apt update && apt upgrade -y

# 2. 安装Node.js 18+
log "安装Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - || curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
yum install -y nodejs || apt install -y nodejs

# 验证安装
node --version || error "Node.js安装失败"
npm --version || error "npm安装失败"

# 3. 安装PM2
log "安装PM2..."
npm install -g pm2

# 4. 安装MongoDB
log "安装MongoDB..."
if command -v yum &> /dev/null; then
    # CentOS/RHEL
    cat > /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
    yum install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
elif command -v apt &> /dev/null; then
    # Ubuntu/Debian
    apt install -y gnupg curl
    curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt update
    apt install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
fi

# 5. 配置防火墙
log "配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    # CentOS/RHEL firewalld
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --reload
elif command -v ufw &> /dev/null; then
    # Ubuntu ufw
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
fi

# 6. 安装其他必要工具
log "安装其他工具..."
if command -v yum &> /dev/null; then
    yum install -y git curl wget unzip
elif command -v apt &> /dev/null; then
    apt install -y git curl wget unzip
fi

# 7. 创建项目目录
log "创建项目目录..."
mkdir -p /www/wwwroot
mkdir -p /www/backups

# 8. 设置时区
log "设置时区为上海..."
timedatectl set-timezone Asia/Shanghai

# 9. 安装Nginx（如果未安装）
if ! command -v nginx &> /dev/null; then
    log "安装Nginx..."
    if command -v yum &> /dev/null; then
        yum install -y nginx
    elif command -v apt &> /dev/null; then
        apt install -y nginx
    fi
    systemctl start nginx
    systemctl enable nginx
fi

# 10. 安装Ollama
log "安装Ollama..."
if command -v yum &> /dev/null; then
    # CentOS/RHEL
    curl -fsSL https://ollama.com/install.sh | sh
elif command -v apt &> /dev/null; then
    # Ubuntu/Debian
    curl -fsSL https://ollama.com/install.sh | sh
fi

# 11. 配置Ollama服务
log "配置Ollama服务..."
systemctl start ollama
systemctl enable ollama

# 12. 拉取必要的模型
log "拉取AI模型..."
ollama pull my_ds_for_test/deepseek-r1
ollama pull nomic-embed-text

# 13. 配置防火墙（添加Ollama端口）
log "配置防火墙（Ollama端口）..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=11434/tcp
    firewall-cmd --reload
elif command -v ufw &> /dev/null; then
    ufw allow 11434/tcp
fi

# 14. 检查服务状态
log "检查服务状态..."
systemctl status mongod --no-pager || warning "MongoDB未运行"
systemctl status nginx --no-pager || warning "Nginx未运行"
systemctl status ollama --no-pager || warning "Ollama未运行"

log "服务器初始化完成！"
log "下一步:"
log "1. 在宝塔面板中添加网站"
log "2. 上传项目文件到 /www/wwwroot/your-domain.com"
log "3. 配置 .env 文件"
log "4. 运行 ./deploy.sh 进行部署"
