#!/bin/bash
# MongoDB生产环境配置脚本

echo "开始配置MongoDB生产环境..."

# 1. 创建MongoDB配置文件
sudo tee /etc/mongod.conf > /dev/null <<EOF
# MongoDB配置文件
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo

security:
  authorization: enabled
EOF

# 2. 重启MongoDB
sudo systemctl restart mongod

# 3. 等待MongoDB启动
sleep 5

# 4. 创建管理员用户
mongo <<EOF
use admin
db.createUser({
  user: "admin",
  pwd: "your-admin-password",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
EOF

# 5. 创建应用数据库和用户
mongo -u admin -p your-admin-password --authenticationDatabase admin <<EOF
use vue_papers_prod
db.createUser({
  user: "app_user",
  pwd: "your-app-password",
  roles: [
    { role: "readWrite", db: "vue_papers_prod" }
  ]
})
EOF

# 6. 更新MONGO_URI
echo "MongoDB配置完成！"
echo "管理员用户: admin"
echo "应用用户: app_user"
echo "数据库: vue_papers_prod"
echo "请更新生产环境配置文件中的MONGO_URI为："
echo "mongodb://app_user:your-app-password@localhost:27017/vue_papers_prod"
