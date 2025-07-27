#!/bin/bash
# Ollama专用配置脚本
# 用于管理和配置Ollama服务

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
    error "请使用root权限运行此脚本: sudo ./ollama-setup.sh"
fi

log "开始配置Ollama..."

# 1. 检查Ollama是否已安装
if ! command -v ollama &> /dev/null; then
    log "安装Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# 2. 创建Ollama服务配置
log "创建Ollama服务配置..."
cat > /etc/systemd/system/ollama.service << EOF
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="PATH=$PATH"

[Install]
WantedBy=default.target
EOF

# 3. 创建ollama用户
if ! id -u ollama &> /dev/null; then
    log "创建ollama用户..."
    useradd -r -s /bin/false ollama
fi

# 4. 设置权限
log "设置Ollama权限..."
chown -R ollama:ollama /usr/share/ollama
mkdir -p /usr/share/ollama/.ollama
chown -R ollama:ollama /usr/share/ollama/.ollama

# 5. 重新加载systemd
log "重新加载systemd..."
systemctl daemon-reload

# 6. 启动Ollama服务
log "启动Ollama服务..."
systemctl start ollama
systemctl enable ollama

# 7. 等待服务启动
log "等待Ollama服务启动..."
sleep 5

# 8. 拉取必要的模型
log "拉取AI模型..."
MODELS=("my_ds_for_test/deepseek-r1" "nomic-embed-text")
for model in "${MODELS[@]}"; do
    log "拉取模型: $model"
    ollama pull $model || warning "无法拉取模型: $model"
done

# 9. 验证模型
log "验证已安装的模型..."
ollama list

# 10. 测试连接
log "测试Ollama连接..."
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    log "Ollama连接正常"
else
    error "无法连接到Ollama服务"
fi

# 11. 创建模型管理脚本
log "创建模型管理脚本..."
cat > /usr/local/bin/ollama-manage.sh << 'EOF'
#!/bin/bash
# Ollama模型管理脚本

case "$1" in
    start)
        systemctl start ollama
        echo "Ollama服务已启动"
        ;;
    stop)
        systemctl stop ollama
        echo "Ollama服务已停止"
        ;;
    restart)
        systemctl restart ollama
        echo "Ollama服务已重启"
        ;;
    status)
        systemctl status ollama
        ;;
    logs)
        journalctl -u ollama -f
        ;;
    models)
        ollama list
        ;;
    pull)
        if [ -z "$2" ]; then
            echo "用法: $0 pull <model-name>"
            exit 1
        fi
        ollama pull "$2"
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status|logs|models|pull <model>}"
        exit 1
        ;;
esac
EOF

chmod +x /usr/local/bin/ollama-manage.sh

# 12. 创建开机自启检查
log "创建开机自启检查..."
cat > /etc/systemd/system/ollama-check.service << EOF
[Unit]
Description=Check Ollama models on boot
After=ollama.service
Requires=ollama.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/ollama-check-models.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

cat > /usr/local/bin/ollama-check-models.sh << 'EOF'
#!/bin/bash
# 检查并确保必要模型已安装

REQUIRED_MODELS=("my_ds_for_test/deepseek-r1" "nomic-embed-text")
for model in "${REQUIRED_MODELS[@]}"; do
    if ! ollama list | grep -q "$model"; then
        echo "拉取缺失的模型: $model"
        ollama pull "$model"
    fi
done
EOF

chmod +x /usr/local/bin/ollama-check-models.sh

# 13. 启用服务
systemctl daemon-reload
systemctl enable ollama-check

log "Ollama配置完成！"
log "使用方法:"
log "  查看状态: ollama-manage.sh status"
log "  查看日志: ollama-manage.sh logs"
log "  查看模型: ollama-manage.sh models"
log "  拉取模型: ollama-manage.sh pull <model-name>"
