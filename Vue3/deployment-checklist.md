# 📋 文献助手系统部署清单

## 🎯 部署架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (Vue3)   │    │   后端 (Node)   │    │   AI服务        │
│   端口: 5173    │────│   端口: 3000    │────│   端口: 11434   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   文献服务      │
                       │   端口: 3001    │
                       └─────────────────┘
```

## 🔧 部署步骤

### 1. 服务器环境准备
- [ ] Ubuntu 20.04+ / CentOS 8+
- [ ] Node.js 18+
- [ ] Python 3.8+
- [ ] MongoDB 5.0+
- [ ] Nginx (反向代理)
- [ ] PM2 (进程管理)
- [ ] Git

### 2. 依赖安装
```bash
# 系统依赖
sudo apt update
sudo apt install nodejs npm python3 python3-pip mongodb nginx

# Python环境
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn faiss-cpu numpy pandas scikit-learn

# Node.js全局工具
npm install -g pm2
```

### 3. 项目部署
```bash
# 克隆项目
git clone https://github.com/chennian-12138/ThelastProject.git
cd ThelastProject

# 前端构建
npm install
npm run build

# 后端依赖
npm install

# Python服务
cd scripts
pip install -r requirements.txt
```

### 4. 环境变量配置
创建 `.env.production` 文件：
```bash
# 前端
VITE_API_BASE_URL=https://your-domain.com/api
VITE_WS_URL=wss://your-domain.com

# 后端
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/vue_papers_prod
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=https://your-domain.com

# Ollama配置
OLLAMA_HOST=localhost:11434
OLLAMA_MODEL=my_ds_for_test/deepseek-r1
```

### 5. 服务启动脚本
创建 `start-services.sh`:
```bash
#!/bin/bash

# 启动MongoDB
sudo systemctl start mongod

# 启动Ollama
ollama serve &

# 等待Ollama启动
sleep 5

# 拉取模型
ollama pull my_ds_for_test/deepseek-r1

# 启动后端
cd backend
pm2 start app.js --name "vue-backend"

# 启动文献服务
cd ../scripts
pm2 start "python -m uvicorn semantic_search:app --host 0.0.0.0 --port 3001" --name "semantic-search"

# 启动前端
cd ..
pm2 start "npm run preview -- --host 0.0.0.0 --port 5173" --name "vue-frontend"

echo "所有服务已启动！"
```

### 6. Nginx配置
创建 `/etc/nginx/sites-available/vue-papers`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 文献服务代理
    location /papers {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket支持
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 7. SSL证书 (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 8. 防火墙配置
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 9. 监控和日志
```bash
# 查看服务状态
pm2 status
pm2 logs vue-backend
pm2 logs semantic-search
pm2 logs vue-frontend

# 系统监控
htop
df -h
```

### 10. 备份策略
```bash
# 数据库备份
mongodump --db vue_papers_prod --out /backup/mongodb/

# 文件备份
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/project
```

## 🚨 常见问题解决

### 1. Ollama连接失败
- 检查服务状态：`systemctl status ollama`
- 重启服务：`sudo systemctl restart ollama`
- 检查端口：`netstat -tulnp | grep 11434`

### 2. MongoDB连接失败
- 检查服务：`sudo systemctl status mongod`
- 查看日志：`tail -f /var/log/mongodb/mongod.log`

### 3. 端口冲突
- 检查端口占用：`lsof -i :3000`
- 修改配置文件中的端口

### 4. 内存不足
- 检查内存：`free -h`
- 增加交换空间：`sudo fallocate -l 2G /swapfile`

## 📊 性能优化建议

### 1. 前端优化
- 启用Gzip压缩
- 使用CDN加速静态资源
- 图片压缩和懒加载

### 2. 后端优化
- 启用Redis缓存
- 数据库索引优化
- API响应缓存

### 3. AI服务优化
- Ollama模型量化
- 请求队列管理
- 并发限制

## 🔍 部署验证清单

部署完成后，请验证：
- [ ] 前端页面正常加载
- [ ] 用户注册/登录功能正常
- [ ] 对话功能正常工作
- [ ] 历史记录保存/加载正常
- [ ] 文献图谱生成功能正常
- [ ] 所有API响应正常
- [ ] SSL证书有效
- [ ] 移动端适配正常

## 📞 紧急联系
如果遇到问题：
1. 检查所有服务状态：`pm2 status`
2. 查看错误日志：`pm2 logs`
3. 检查系统资源：`htop`
4. 重启所有服务：`pm2 restart all`
