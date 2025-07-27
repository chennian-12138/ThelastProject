#!/bin/bash
# 部署脚本 - 用于阿里云宝塔Linux服务器
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_DIR="/www/wwwroot/your-domain.com"  # 替换为你的实际路径
BACKUP_DIR="/www/backups/vue-papers"
DOMAIN="your-domain.com"  # 替换为你的域名
LOG_FILE="/var/log/deploy-vue-papers.log"

# 创建日志文件
touch $LOG_FILE

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# 检查是否以root权限运行
if [[ $EUID -ne 0 ]]; then
    error "请使用root权限运行此脚本: sudo ./deploy.sh"
fi

log "开始部署 Vue Papers 项目..."

# 1. 创建必要的目录
log "创建必要的目录..."
mkdir -p $PROJECT_DIR
mkdir -p $BACKUP_DIR
mkdir -p $PROJECT_DIR/logs
mkdir -p $PROJECT_DIR/uploads

# 2. 备份旧版本
if [ -d "$PROJECT_DIR/dist" ]; then
    log "备份旧版本..."
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    cp -r $PROJECT_DIR/dist $BACKUP_DIR/$BACKUP_NAME
    log "备份已保存到: $BACKUP_DIR/$BACKUP_NAME"
fi

# 3. 安装依赖
log "安装Node.js依赖..."
cd $PROJECT_DIR
if [ -f "package.json" ]; then
    npm install --production || error "npm install 失败"
else
    error "package.json 未找到"
fi

# 4. 构建前端
log "构建前端..."
npm run build || error "前端构建失败"

# 5. 设置文件权限
log "设置文件权限..."
chown -R www:www $PROJECT_DIR
chmod -R 755 $PROJECT_DIR
chmod -R 775 $PROJECT_DIR/logs
chmod -R 775 $PROJECT_DIR/uploads

# 6. 检查并安装PM2
if ! command -v pm2 &> /dev/null; then
    log "安装PM2..."
    npm install -g pm2 || error "PM2安装失败"
fi

# 7. 重启后端服务
log "重启后端服务..."
cd $PROJECT_DIR
pm2 delete vue-papers-backend 2>/dev/null || true
pm2 start ecosystem.config.js --env production || error "PM2启动失败"
pm2 save || warning "PM2保存配置失败"

# 8. 设置PM2开机自启
log "设置PM2开机自启..."
pm2 startup systemd -u www --hp /www/wwwroot || warning "PM2开机自启设置失败"

# 9. 重启Nginx
log "重启Nginx..."
if systemctl is-active --quiet nginx; then
    systemctl restart nginx || warning "Nginx重启失败"
else
    warning "Nginx未运行，请手动启动"
fi

# 10. 检查服务状态
log "检查服务状态..."
pm2 status vue-papers-backend || warning "无法获取PM2状态"

# 11. 检查Ollama服务
log "检查Ollama服务..."
if systemctl is-active --quiet ollama; then
    log "Ollama服务运行正常"
else
    warning "Ollama服务未运行，正在启动..."
    systemctl start ollama
fi

# 12. 健康检查
log "进行健康检查..."
sleep 5
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log "后端服务运行正常"
else
    warning "后端服务可能未正常运行，请检查日志"
fi

# 13. 检查Ollama连接
log "检查Ollama连接..."
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    log "Ollama连接正常"
else
    warning "无法连接到Ollama，请检查服务状态"
fi

log "部署完成！"
log "前端访问: https://$DOMAIN"
log "PM2日志: pm2 logs vue-papers-backend"
log "项目日志: tail -f $PROJECT_DIR/logs/backend-combined.log"
log "Ollama日志: journalctl -u ollama -f"
