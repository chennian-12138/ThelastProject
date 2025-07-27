# 阿里云轻量应用服务器IP地址部署指南

## 🎯 无需域名，直接使用IP地址部署

### 📋 准备工作

1. **获取服务器信息**
   - 登录阿里云控制台
   - 进入轻量应用服务器管理页面
   - 找到你的服务器公网IP地址（例如：47.100.123.45）

2. **开放端口**
   - 在阿里云控制台的安全组中开放端口：
     - 80 (HTTP)
     - 3000 (Node.js后端)
     - 11434 (Ollama)

### 🚀 快速部署步骤

#### 步骤1：连接服务器
```bash
# 使用SSH连接到你的服务器
ssh root@你的服务器IP
```

#### 步骤2：上传项目
```bash
# 在本地项目目录执行
scp -r * root@你的服务器IP:/www/wwwroot/your-ip/
```

#### 步骤3：修改配置文件
**重要：将以下文件中的占位符替换为你的实际IP地址**

1. **修改Nginx配置** (`deployment/nginx.conf`)
   - 将 `your-ip-address` 替换为你的实际IP
   - 将 `/www/wwwroot/your-ip-address/` 替换为你的实际路径

2. **修改环境变量** (复制为 `.env` 后修改)
   ```bash
   # 在服务器上执行
   cd /www/wwwroot/your-ip/
   cp deployment/.env.production .env
   
   # 编辑.env文件
   nano .env
   # 修改以下行：
   CORS_ORIGIN=*
   API_BASE_URL=http://你的IP地址/api
   ```

3. **修改PM2配置** (`deployment/ecosystem.config.js`)
   - 将 `cwd` 路径改为你的实际路径

#### 步骤4：执行部署
```bash
# 在服务器上执行
cd /www/wwwroot/your-ip/

# 给脚本执行权限
chmod +x deployment/*.sh

# 运行初始化脚本
sudo ./deployment/setup-server.sh

# 运行部署脚本
sudo ./deployment/deploy.sh
```

### 📁 目录结构（使用IP地址）
```
/www/wwwroot/你的IP地址/
├── backend/          # 后端代码
├── dist/            # 前端构建文件
├── deployment/      # 部署文件
├── logs/           # 日志文件
├── uploads/        # 上传文件
├── .env            # 环境变量
└── package.json    # 项目配置
```

### 🔗 访问地址

部署完成后，你可以通过以下地址访问：

- **前端页面**: `http://你的服务器IP`
- **API接口**: `http://你的服务器IP/api`
- **健康检查**: `http://你的服务器IP/api/health`

### ⚠️ 注意事项

1. **IP地址变化**
   - 如果服务器重启后IP地址变化，需要重新修改配置文件
   - 建议购买固定IP或使用域名

2. **安全性**
   - IP地址访问没有HTTPS加密
   - 建议后续配置域名和SSL证书

3. **防火墙设置**
   - 确保阿里云安全组和服务器防火墙都开放了必要端口

### 🛠️ 宝塔面板配置（使用IP）

1. **添加网站**
   - 域名：直接输入你的IP地址
   - 根目录：`/www/wwwroot/你的IP地址`
   - 不需要申请SSL证书

2. **配置Nginx**
   - 将 `deployment/nginx.conf` 的内容复制到宝塔面板的网站配置中
   - 记得修改IP地址相关的路径

### 🔍 故障排除

#### 无法访问？
1. 检查服务器是否运行：`ping 你的IP`
2. 检查端口是否开放：`telnet 你的IP 80`
3. 检查服务状态：`systemctl status nginx`
4. 检查防火墙：`iptables -L` 或 `firewall-cmd --list-all`

#### 服务启动失败？
```bash
# 查看详细日志
pm2 logs vue-papers-backend
journalctl -u nginx
```

### 📞 获取帮助

如果遇到问题：
1. 检查服务器IP是否正确
2. 确认所有服务都已启动
3. 查看日志文件获取错误信息
4. 确保端口已开放
