# Vue3项目阿里云快速部署（15分钟完成）

## 🚀 超快速部署（适合有经验用户）

### 1. 购买阿里云ECS
- **实例**: 2核4GB Ubuntu 22.04
- **地域**: 华东1（杭州）
- **带宽**: 5Mbps
- **安全组**: 开放22, 80, 443端口

### 2. 一键部署命令

```bash
# 连接服务器后执行
ssh root@your-server-ip

# 一键安装环境
curl -sSL https://raw.githubusercontent.com/chennian-12138/ThelastProject/main/deployment/aliyun-setup.sh | bash

# 克隆项目
git clone https://github.com/chennian-12138/ThelastProject.git
cd ThelastProject

# 一键部署
chmod +x deployment/deploy.sh && ./deployment/deploy.sh
```

### 3. 配置域名（可选）

```bash
# 修改Nginx配置
sudo nano /etc/nginx/sites-available/vue-app
# 将your-domain.com改为你的域名

# 重启Nginx
sudo nginx -t && sudo systemctl restart nginx
```

### 4. 访问测试
- 前端: http://your-server-ip
- 后端API: http://your-server-ip/api/health

## 📋 最小配置清单

### 必须修改的配置
1. **后端环境变量** (`/var/www/vue-app/backend/.env`):
   ```bash
   MONGO_URI=mongodb://localhost:27017/vue_papers_prod
   JWT_SECRET=your-64-char-random-secret-key-here
   FRONTEND_URL=http://your-server-ip
   ```

2. **MongoDB初始化**:
   ```bash
   mongo
   use vue_papers_prod
   ```

### 3. 常用命令
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart vue-app-backend

# 更新代码
git pull && ./deployment/deploy.sh
```

## 🎯 完成！

部署完成后，你的Vue3应用将在阿里云上运行：
- 前端: http://your-server-ip
- 后端API: http://your-server-ip/api

如需域名和HTTPS，请参考完整部署指南。
