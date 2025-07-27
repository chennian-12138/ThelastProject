#!/bin/bash
# Ollama生产环境安装和配置脚本

echo "========================================"
echo "    Ollama 生产环境安装脚本"
echo "========================================"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查系统要求
echo -e "${YELLOW}[1/6] 检查系统要求...${NC}"
if ! command -v curl &> /dev/null; then
    echo -e "${RED}错误：curl 未安装${NC}"
    exit 1
fi

# 安装Ollama
echo -e "${YELLOW}[2/6] 安装Ollama...${NC}"
curl -fsSL https://ollama.ai/install.sh | sh
if [ $? -ne 0 ]; then
    echo -e "${RED}错误：Ollama安装失败${NC}"
    exit 1
fi

# 启动Ollama服务
echo -e "${YELLOW}[3/6] 启动Ollama服务...${NC}"
sudo systemctl start ollama
sudo systemctl enable ollama

# 等待服务启动
sleep 5

# 检查服务状态
if ! systemctl is-active --quiet ollama; then
    echo -e "${RED}错误：Ollama服务启动失败${NC}"
    exit 1
fi

# 下载所需模型
echo -e "${YELLOW}[4/6] 下载AI模型...${NC}"

# 下载DeepSeek模型（用于对话）
echo -e "${YELLOW}  下载 DeepSeek-R1 模型...${NC}"
ollama pull deepseek-r1:7b

# 下载nomic-embed-text模型（用于向量化）
echo -e "${YELLOW}  下载 nomic-embed-text 模型...${NC}"
ollama pull nomic-embed-text

# 验证模型下载
echo -e "${YELLOW}[5/6] 验证模型...${NC}"
if ollama list | grep -q "deepseek-r1"; then
    echo -e "${GREEN}  ✓ DeepSeek模型已就绪${NC}"
else
    echo -e "${RED}  ✗ DeepSeek模型下载失败${NC}"
fi

if ollama list | grep -q "nomic-embed-text"; then
    echo -e "${GREEN}  ✓ nomic-embed-text模型已就绪${NC}"
else
    echo -e "${RED}  ✗ nomic-embed-text模型下载失败${NC}"
fi

# 配置Ollama服务
echo -e "${YELLOW}[6/6] 配置Ollama服务...${NC}"

# 创建Ollama配置文件
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo tee /etc/systemd/system/ollama.service.d/override.conf > /dev/null <<EOF
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"
EOF

# 重新加载配置并重启服务
sudo systemctl daemon-reload
sudo systemctl restart ollama

# 设置防火墙规则（如果启用）
if sudo ufw status | grep -q "Status: active"; then
    echo -e "${YELLOW}配置防火墙...${NC}"
    sudo ufw allow 11434/tcp
fi

# 创建模型更新脚本
sudo tee /usr/local/bin/update-ollama-models.sh > /dev/null <<'EOF'
#!/bin/bash
# Ollama模型更新脚本
echo "开始更新Ollama模型..."
ollama pull deepseek-r1:7b
ollama pull nomic-embed-text
echo "模型更新完成"
EOF

sudo chmod +x /usr/local/bin/update-ollama-models.sh

# 创建服务监控脚本
sudo tee /usr/local/bin/check-ollama.sh > /dev/null <<'EOF'
#!/bin/bash
# Ollama服务监控脚本
if ! systemctl is-active --quiet ollama; then
    echo "$(date): Ollama服务未运行，正在重启..."
    sudo systemctl start ollama
fi
EOF

sudo chmod +x /usr/local/bin/check-ollama.sh

# 添加到crontab（每5分钟检查一次）
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/check-ollama.sh >> /var/log/ollama-check.log 2>&1") | crontab -

echo "========================================"
echo -e "${GREEN}Ollama安装和配置完成！${NC}"
echo "========================================"
echo
echo "服务状态："
systemctl status ollama --no-pager -l
echo
echo "已安装模型："
ollama list
echo
echo "API端点："
echo "  对话API: http://localhost:11434/api/generate"
echo "  向量化API: http://localhost:11434/api/embeddings"
echo
echo "测试命令："
echo "  curl http://localhost:11434/api/generate -d '{\"model\":\"deepseek-r1:7b\",\"prompt\":\"你好\",\"stream\":false}'"
echo
echo "如需更新模型，运行："
echo "  sudo /usr/local/bin/update-ollama-models.sh"
