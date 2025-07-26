# 生产环境安全检查清单

## 🔐 服务器安全

### 1. 系统安全
- [ ] 更新系统到最新版本
- [ ] 配置防火墙（仅开放必要端口：22, 80, 443）
- [ ] 禁用root用户SSH登录
- [ ] 配置SSH密钥认证
- [ ] 设置fail2ban防止暴力破解

### 2. 用户和权限
- [ ] 创建非root用户并赋予sudo权限
- [ ] 设置强密码策略
- [ ] 配置文件权限（755/644）
- [ ] 定期审查用户权限

### 3. 网络安全
- [ ] 配置阿里云安全组
- [ ] 启用DDoS防护
- [ ] 配置Web应用防火墙（WAF）

## 🗄️ 数据库安全

### 1. MongoDB安全
- [ ] 启用身份验证
- [ ] 创建专用数据库用户
- [ ] 限制数据库访问IP
- [ ] 定期备份数据
- [ ] 配置MongoDB日志

### 2. 数据加密
- [ ] 敏感数据加密存储
- [ ] 传输数据使用HTTPS
- [ ] JWT密钥使用强随机字符串

## 🌐 应用安全

### 1. 前端安全
- [ ] 启用HTTPS
- [ ] 配置安全头（XSS, CSRF保护）
- [ ] 输入验证和过滤
- [ ] 防止XSS攻击

### 2. 后端安全
- [ ] 输入验证和过滤
- [ ] API限流
- [ ] 错误处理不泄露敏感信息
- [ ] 定期更新依赖包

### 3. 认证和授权
- [ ] 强密码策略
- [ ] JWT令牌过期时间
- [ ] 会话管理
- [ ] 权限控制

## 📊 监控和日志

### 1. 系统监控
- [ ] 安装监控工具（htop, iotop）
- [ ] 配置磁盘空间监控
- [ ] 设置内存和CPU告警

### 2. 应用监控
- [ ] 配置PM2监控
- [ ] 设置应用健康检查
- [ ] 配置错误日志收集

### 3. 访问日志
- [ ] 配置Nginx访问日志
- [ ] 配置应用日志
- [ ] 设置日志轮转

## 🔄 备份策略

### 1. 数据备份
- [ ] 每日数据库备份
- [ ] 每周全量备份
- [ ] 异地备份存储

### 2. 配置备份
- [ ] Nginx配置备份
- [ ] 应用配置备份
- [ ] SSL证书备份

## 🚨 应急响应

### 1. 安全事件响应
- [ ] 制定应急响应计划
- [ ] 配置安全告警
- [ ] 准备回滚方案

### 2. 故障恢复
- [ ] 制定故障恢复流程
- [ ] 定期测试备份恢复
- [ ] 准备紧急联系方式

## 📋 部署前最终检查

### 1. 配置文件检查
- [ ] 生产环境变量配置正确
- [ ] 数据库连接字符串正确
- [ ] 域名和SSL证书配置正确

### 2. 功能测试
- [ ] 前端页面正常访问
- [ ] API接口正常工作
- [ ] 用户认证功能正常
- [ ] 数据库读写正常

### 3. 性能测试
- [ ] 页面加载速度测试
- [ ] API响应时间测试
- [ ] 并发用户测试

## 🔧 安全加固脚本

```bash
# 运行安全加固脚本
sudo apt install fail2ban -y
sudo systemctl enable fail2ban

# 配置SSH安全
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 📞 紧急联系方式
- 阿里云客服：400-80-13260
- 技术支持邮箱：support@your-domain.com
- 监控告警：monitor@your-domain.com
