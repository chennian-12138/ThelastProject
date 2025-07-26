# Vue3项目阿里云部署指南

## 📋 部署前准备

### 1. 阿里云资源清单
- **ECS实例**: 2核4GB内存，Ubuntu 22.04 LTS
- **域名**: your-domain.com（可选但推荐）
- **SSL证书**: 阿里云免费SSL证书（可选）
- **MongoDB**: 阿里云MongoDB实例或自建MongoDB

### 2. 本地准备
- 确保项目能在本地正常运行
- 安装Git并配置SSH密钥
- 准备好生产环境配置文件

## 🚀 完整部署流程

### 第一步：购买和配置阿里云ECS

1. 登录阿里云控制台
2. 进入ECS控制台，创建实例
3. 选择配置：
   - 地域：华东1（杭州）或华北2（北京）
   - 实例规格：ecs.c6.large（2核4GB）
   - 镜像：Ubuntu 22.04 LTS
   - 存储：40GB系统盘 + 100GB数据盘
   - 带宽：5Mbps
   - 安全组：开放22(SSH)、80(HTTP)、443(HTTPS)端口

### 第二步：连接服务器并初始化

```bash
# 使用SSH连接服务器
ssh root@your-server-ip

# 运行初始化脚本
curl -o aliyun-setup.sh https://raw.githubusercontent.com/your-repo/main/deployment/aliyun-setup.sh
chmod +x aliyun-setup.sh
./aliyun-setup.sh
```

### 第三步：配置域名和SSL（可选）

1. 在阿里云购买域名
2. 配置域名解析到ECS公网IP
3. 申请免费SSL证书
4. 下载证书文件到服务器

### 第四步：部署项目

```bash
# 克隆项目到服务器
git clone https://github.com/chennian-12138/ThelastProject.git
cd ThelastProject

# 运行部署脚本
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

### 第五步：配置Nginx

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
MONGO_URI=mongodb://localhost:27017/vue_papers_prod
JWT_SECRET=your-very-long-random-secret-key
FRONTEND_URL=https://your-domain.com
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

### 3. PM2进程管理
```bash
# 启动应用
pm2 start /var/www/vue-app/backend/app.js --name vue-app-backend

# 保存PM2配置
pm2 save
pm2 startup
```

## 📊 监控和维护

### 1. 日志查看
```bash
# 查看应用日志
pm2 logs vue-app-backend

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 性能监控
```bash
# 安装htop
sudo apt install htop

# 查看系统资源
htop

# 查看MongoDB状态
sudo systemctl status mongod
```

### 3. 备份策略
```bash
# MongoDB备份
mongodump --db vue_papers_prod --out /backup/mongodb-$(date +%Y%m%d)

# 文件备份
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/vue-app/
```

## 🚨 常见问题解决

### 1. 端口未开放
- 检查阿里云安全组配置
- 检查服务器防火墙：`sudo ufw status`

### 2. 权限问题
```bash
sudo chown -R www-data:www-data /var/www/vue-app
sudo chmod -R 755 /var/www/vue-app
```

### 3. 502 Bad Gateway
- 检查Node.js服务是否运行：`pm2 status`
- 检查端口是否被占用：`sudo netstat -tulnp | grep 3000`

### 4. 前端路由问题
- 确保Nginx配置了try_files
- 检查dist目录是否正确部署

## 🔄 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deployment/deploy.sh

# 只更新后端
pm2 restart vue-app-backend
```

## 📞 技术支持

如有问题，请检查：
1. 阿里云控制台安全组配置
2. 服务器防火墙设置
3. 应用日志和错误信息
4. Nginx配置是否正确
