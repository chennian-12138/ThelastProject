# Vue3项目阿里云部署指南（含Ollama）

## 📋 部署前准备

### 1. 阿里云资源清单
- **ECS实例**: 4核8GB内存（推荐，因为需要运行Ollama）
- **操作系统**: Ubuntu 22.04 LTS
- **存储**: 100GB SSD（模型占用约15GB）
- **带宽**: 5Mbps
- **域名**: your-domain.com（可选但推荐）
- **SSL证书**: 阿里云免费SSL证书（可选）

### 2. 系统要求
- **CPU**: 至少4核（Ollama需要较多计算资源）
- **内存**: 至少8GB（DeepSeek 7B模型需要约8GB内存）
- **存储**: 至少50GB可用空间

## 🚀 完整部署流程

### 第一步：购买和配置阿里云ECS

1. 登录阿里云控制台
2. 进入ECS控制台，创建实例
3. 选择配置：
   - 地域：华东1（杭州）或华北2（北京）
   - 实例规格：ecs.c6.xlarge（4核8GB）
   - 镜像：Ubuntu 22.04 LTS
   - 存储：100GB SSD
   - 带宽：5Mbps
   - 安全组：开放22(SSH)、80(HTTP)、443(HTTPS)、11434(Ollama)端口

### 第二步：连接服务器并初始化

```bash
# 使用SSH连接服务器
ssh root@your-server-ip

# 运行初始化脚本（包含Ollama）
curl -o aliyun-setup.sh https://raw.githubusercontent.com/your-repo/main/deployment/aliyun-setup.sh
chmod +x aliyun-setup.sh
./aliyun-setup.sh
```

### 第三步：单独安装Ollama（可选）

如果初始化脚本中Ollama安装失败，可以单独运行：

```bash
# 下载并运行Ollama安装脚本
curl -o ollama-setup.sh https://raw.githubusercontent.com/your-repo/main/deployment/ollama-setup.sh
chmod +x ollama-setup.sh
./ollama-setup.sh
```

### 第四步：验证Ollama安装

```bash
# 检查Ollama状态
sudo systemctl status ollama

# 查看已安装模型
ollama list

# 测试API
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:7b",
  "prompt": "你好，请介绍一下自己",
  "stream": false
}'
```

### 第五步：部署项目

```bash
# 克隆项目到服务器
git clone https://github.com/chennian-12138/ThelastProject.git
cd ThelastProject

# 运行部署脚本
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

### 第六步：配置Nginx

```bash
# 复制Nginx配置
sudo cp deployment/nginx-config.conf /etc/nginx/sites-available/vue-app
sudo ln -s /etc/nginx/sites-available/vue-app /etc/nginx/sites-enabled/

# 测试并重启Nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 生产环境配置

### 1. 环境变量配置
编辑 `/var/www/vue-app/backend/.env`：
```bash
# MongoDB连接
MONGO_URI=mongodb://localhost:27017/vue_papers_prod

# JWT密钥
JWT_SECRET=your-very-long-random-secret-key

# 前端URL
FRONTEND_URL=https://your-domain.com

# Ollama配置
OLLAMA_API_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=deepseek-r1:7b
OLLAMA_EMBED_MODEL=nomic-embed-text

# 生产环境
NODE_ENV=production
```

### 2. MongoDB配置
```bash
# 创建生产数据库
mongo
use vue_papers_prod
db.createUser({
  user: "app_user",
  pwd: "your-strong-password",
  roles: [{ role: "readWrite", db: "vue_papers_prod" }]
})
```

### 3. 更新MONGO_URI
```bash
# 更新为带认证的连接字符串
MONGO_URI=mongodb://app_user:your-strong-password@localhost:27017/vue_papers_prod
```

## 📊 资源监控

### 1. 系统资源检查
```bash
# 查看内存使用
free -h

# 查看CPU使用
htop

# 查看磁盘使用
df -h

# 查看Ollama资源使用
ps aux | grep ollama
```

### 2. Ollama性能优化
```bash
# 查看Ollama日志
journalctl -u ollama -f

# 限制Ollama内存使用（可选）
sudo systemctl edit ollama
# 添加以下内容：
# [Service]
# MemoryMax=6G
```

## 🚨 常见问题解决

### 1. Ollama启动失败
```bash
# 检查日志
journalctl -u ollama --no-pager

# 重启服务
sudo systemctl restart ollama

# 检查端口占用
sudo netstat -tulnp | grep 11434
```

### 2. 内存不足
- 升级ECS实例到8GB内存
- 使用更小的模型（如deepseek-r1:1.5b）
- 配置swap空间

### 3. 模型下载慢
```bash
# 使用国内镜像（可选）
export OLLAMA_HOST=https://ollama.ai
ollama pull deepseek-r1:7b
```

## 🔄 模型管理

### 1. 更新模型
```bash
# 更新所有模型
ollama pull deepseek-r1:7b
ollama pull nomic-embed-text
```

### 2. 删除模型
```bash
# 删除不需要的模型
ollama rm model-name
```

### 3. 查看模型信息
```bash
# 查看模型详情
ollama show deepseek-r1:7b
```

## 📈 性能优化建议

### 1. 硬件优化
- **推荐配置**: 8核16GB内存，200GB SSD
- **GPU加速**: 可选配GPU实例（如NVIDIA T4）

### 2. 软件优化
- 使用Redis缓存
- 配置CDN加速
- 数据库索引优化

### 3. 监控告警
- 配置云监控
- 设置内存使用率告警
- 设置CPU使用率告警

## 🎯 快速检查清单

### 部署前：
- [ ] ECS实例规格确认（4核8GB+）
- [ ] 安全组端口配置（22,80,443,11434）
- [ ] 域名和SSL证书（可选）

### 部署后：
- [ ] http://your-server-ip 能访问前端
- [ ] http://your-server-ip/api/health 返回健康状态
- [ ] Ollama API正常工作
- [ ] AI对话功能正常
- [ ] 搜索功能正常

## 📞 技术支持

### Ollama相关问题
- 官方文档：https://github.com/ollama/ollama
- 社区支持：GitHub Issues

### 阿里云支持
- 阿里云客服：400-80-13260
- 阿里云文档：https://help.aliyun.com

### 性能监控
- 云监控：https://cloudmonitor.console.aliyun.com
