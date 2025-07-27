# Vue Papers 项目部署指南

## 阿里云宝塔Linux服务器部署完整指南

### 📋 部署前准备

#### 1. 服务器要求
- **操作系统**: CentOS 7+/Ubuntu 18.04+
- **内存**: 至少 2GB RAM
- **存储**: 至少 10GB 可用空间
- **网络**: 开放端口 80, 443, 3000

#### 2. 域名准备
- 已备案的域名
- 域名解析到服务器IP

### 🚀 快速开始

#### 步骤1: 服务器初始化
```bash
# 在服务器上运行（使用root权限）
chmod +x setup-server.sh
sudo ./setup-server.sh
```

#### 步骤2: 配置Ollama（可选，如果setup-server.sh未包含）
```bash
# 单独配置Ollama
chmod +x deployment/ollama-setup.sh
sudo ./deployment/ollama-setup.sh
```

#### 步骤3: 宝塔面板配置
1. 登录宝塔面板
2. 添加网站
   - 域名: your-domain.com
   - 根目录: /www/wwwroot/your-domain.com
   - 创建数据库（可选）

#### 步骤4: 上传项目
```bash
# 在本地项目目录
scp -r * root@your-server-ip:/www/wwwroot/your-domain.com/
```

#### 步骤5: 配置环境变量
```bash
# 在服务器上
cd /www/wwwroot/your-domain.com
cp deployment/.env.production .env
# 编辑 .env 文件，修改相关配置
nano .env
```

#### 步骤6: 部署项目
```bash
# 在服务器上
cd /www/wwwroot/your-domain.com
chmod +x deployment/deploy.sh
sudo ./deployment/deploy.sh
```

### 🔧 配置文件说明

#### 1. Nginx配置
- **文件**: `deployment/nginx.conf`
- **用途**: 网站服务器配置
- **操作**: 复制到宝塔面板网站配置中

#### 2. PM2配置
- **文件**: `deployment/ecosystem.config.js`
- **用途**: Node.js进程管理
- **操作**: 自动使用，无需手动配置

#### 3. 环境变量
- **文件**: `deployment/.env.production`
- **用途**: 生产环境配置
- **操作**: 复制为 `.env` 并修改

### 📁 目录结构
```
/www/wwwroot/your-domain.com/
├── backend/          # 后端代码
├── dist/            # 前端构建文件
├── deployment/      # 部署文件
├── logs/           # 日志文件
├── uploads/        # 上传文件
├── .env            # 环境变量
├── ecosystem.config.js  # PM2配置
└── package.json    # 项目配置
```

### 🔍 常用命令

#### 服务管理
```bash
# 查看PM2状态
pm2 status

# 查看日志
pm2 logs vue-papers-backend

# 重启服务
pm2 restart vue-papers-backend

# 停止服务
pm2 stop vue-papers-backend

# 启动服务
pm2 start vue-papers-backend
```

#### 日志查看
```bash
# 后端日志
tail -f logs/backend-combined.log

# Nginx日志
tail -f /www/wwwlogs/your-domain.com.log
```

### 🛠️ 故障排除

#### 1. 端口被占用
```bash
# 检查端口占用
netstat -tulnp | grep 3000

# 杀掉占用进程
kill -9 <PID>
```

#### 2. MongoDB连接失败
```bash
# 检查MongoDB状态
systemctl status mongod

# 重启MongoDB
systemctl restart mongod

# 查看MongoDB日志
tail -f /var/log/mongodb/mongod.log
```

#### 3. 权限问题
```bash
# 修复权限
chown -R www:www /www/wwwroot/your-domain.com
chmod -R 755 /www/wwwroot/your-domain.com
```

#### 4. 内存不足
```bash
# 查看内存使用
free -h

# 查看进程内存使用
ps aux --sort=-%mem | head
```

### 🔐 安全建议

1. **修改默认密码**
   - MongoDB管理员密码
   - 宝塔面板密码
   - 服务器SSH密码

2. **配置防火墙**
   - 只开放必要端口
   - 使用fail2ban防暴力破解

3. **SSL证书**
   - 使用宝塔面板申请Let's Encrypt证书
   - 设置自动续期

4. **定期备份**
   - 数据库备份
   - 项目文件备份
   - 配置文件备份

### 📊 性能优化

#### 1. Nginx优化
- 启用Gzip压缩
- 设置静态资源缓存
- 配置CDN（可选）

#### 2. Node.js优化
- 使用PM2集群模式
- 启用Node.js生产模式
- 监控内存使用

#### 3. MongoDB优化
- 创建索引
- 配置内存限制
- 定期清理日志

### 📞 技术支持

遇到问题时的排查步骤：
1. 检查服务状态
2. 查看错误日志
3. 检查配置文件
4. 验证网络连接
5. 检查资源使用

### 🔄 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新部署
sudo ./deployment/deploy.sh
```

### 🤖 Ollama相关

#### Ollama服务管理
```bash
# 查看Ollama状态
systemctl status ollama

# 启动Ollama
sudo systemctl start ollama

# 停止Ollama
sudo systemctl stop ollama

# 重启Ollama
sudo systemctl restart ollama

# 查看Ollama日志
journalctl -u ollama -f

# 使用管理脚本
ollama-manage.sh status
ollama-manage.sh logs
ollama-manage.sh models
```

#### 模型管理
```bash
# 查看已安装模型
ollama list

# 拉取新模型
ollama pull <model-name>

# 删除模型
ollama rm <model-name>

# 测试模型
curl http://localhost:11434/api/generate -d '{
  "model": "my_ds_for_test/deepseek-r1",
  "prompt": "你好",
  "stream": false
}'
```

### 📋 部署检查清单

- [ ] 服务器初始化完成
- [ ] Ollama安装和配置完成
- [ ] 必要AI模型已拉取
- [ ] 域名解析正确
- [ ] 宝塔面板网站添加成功
- [ ] 项目文件上传完成
- [ ] 环境变量配置正确
- [ ] MongoDB运行正常
- [ ] Ollama服务运行正常
- [ ] 后端服务启动成功
- [ ] 前端页面访问正常
- [ ] SSL证书配置完成
- [ ] 防火墙配置正确
- [ ] AI功能测试正常
