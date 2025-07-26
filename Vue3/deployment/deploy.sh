#!/bin/bash
# 项目部署脚本

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署Vue3项目到阿里云...${NC}"

# 1. 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误：请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 2. 安装前端依赖
echo -e "${YELLOW}安装前端依赖...${NC}"
npm install

# 3. 构建前端
echo -e "${YELLOW}构建前端...${NC}"
npm run build

# 4. 检查构建结果
if [ ! -d "dist" ]; then
    echo -e "${RED}错误：前端构建失败，dist目录不存在${NC}"
    exit 1
fi

# 5. 安装后端依赖
echo -e "${YELLOW}安装后端依赖...${NC}"
cd backend
npm install --production
cd ..

# 6. 复制文件到部署目录
echo -e "${YELLOW}复制文件到部署目录...${NC}"
sudo rm -rf /var/www/vue-app/*
sudo mkdir -p /var/www/vue-app/frontend
sudo mkdir -p /var/www/vue-app/backend

# 复制前端构建文件
sudo cp -r dist/* /var/www/vue-app/frontend/
sudo cp -r dist /var/www/vue-app/frontend/dist

# 复制后端文件
sudo cp -r backend/* /var/www/vue-app/backend/
sudo cp deployment/production.env /var/www/vue-app/backend/.env

# 设置权限
sudo chown -R www-data:www-data /var/www/vue-app
sudo chmod -R 755 /var/www/vue-app

# 7. 重启后端服务
echo -e "${YELLOW}重启后端服务...${NC}"
cd /var/www/vue-app/backend
pm2 restart vue-app-backend || pm2 start app.js --name vue-app-backend

# 8. 测试后端服务
sleep 3
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务启动成功${NC}"
else
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    exit 1
fi

# 9. 重启Nginx
echo -e "${YELLOW}重启Nginx...${NC}"
sudo nginx -t && sudo systemctl restart nginx

# 10. 部署完成
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}前端访问：http://your-domain.com${NC}"
echo -e "${GREEN}后端API：http://your-domain.com/api${NC}"
