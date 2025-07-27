# 🚀 Vue3项目阿里云部署完整方案（含Ollama）

## 📋 更新说明
**新增Ollama支持** - 现在包含完整的AI模型部署方案！

## 🎯 项目架构（含Ollama）
- **前端**: Vue3 + TypeScript + Vite
- **后端**: Node.js + Express + MongoDB
- **AI服务**: Ollama + DeepSeek-R1 + nomic-embed-text
- **部署**: 阿里云ECS + Ubuntu 22.04

## 🚨 重要提醒
由于项目使用了Ollama AI服务，**服务器配置要求升级**：
- **最低配置**: 4核8GB内存
- **推荐配置**: 8核16GB内存
- **存储**: 100GB SSD（模型占用约15GB）
- **端口**: 需额外开放11434端口（Ollama）

## 📁 新增部署文件

| 文件 | 用途 | 说明 |
|---|---|---|
| `ollama-setup.sh` | Ollama安装和配置 | 包含模型下载和优化 |
| 更新后的配置文件 | 支持Ollama集成 | 包含Ollama相关环境变量 |

## 🚀 快速部署（含Ollama）

### 1. 购买阿里云ECS（重要！）
- **实例规格**: ecs.c6.xlarge（4核8GB）或更高
- **安全组端口**: 22, 80, 443, **11434**（Ollama）

### 2. 一键部署命令
```bash
# 连接服务器
ssh root@your-server-ip

# 运行完整初始化（包含Ollama）
curl -sSL https://raw.githubusercontent.com/chennian-12138/ThelastProject/main/deployment/aliyun-setup.sh | bash
```

### 3. 验证Ollama安装
```bash
# 检查服务状态
sudo systemctl status ollama

# 查看已安装模型
ollama list

# 测试AI功能
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:7b",
  "prompt": "你好，请介绍一下自己",
  "stream": false
}'
```

## 🔧 环境变量更新

新增Ollama相关配置：
```bash
# Ollama配置
OLLAMA_API_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=deepseek-r1:7b
OLLAMA_EMBED_MODEL=nomic-embed-text
```

## 📊 资源需求对比

| 配置类型 | CPU | 内存 | 存储 | 费用/月 | 适用场景 |
|---|---|---|---|---|---|
| **基础** | 2核 | 4GB | 50GB | ¥200 | 无Ollama |
| **AI基础** | 4核 | 8GB | 100GB | ¥400 | 有Ollama |
| **AI推荐** | 8核 | 16GB | 200GB | ¥800 | 高并发 |

## 🎯 部署验证清单

### 部署前检查：
- [ ] ECS实例规格 ≥ 4核8GB
- [ ] 安全组包含端口11434
- [ ] 存储空间 ≥ 100GB

### 部署后验证：
- [ ] 前端正常访问
- [ ] 后端API正常
- [ ] Ollama服务运行
- [ ] AI对话功能正常
- [ ] 语义搜索功能正常

## 🚨 常见问题（Ollama相关）

### 1. 内存不足
- **症状**: Ollama启动失败或响应慢
- **解决**: 升级到8GB+内存或使用更小模型

### 2. 模型下载慢
- **症状**: 模型下载超时
- **解决**: 使用国内镜像或手动下载

### 3. 端口未开放
- **症状**: 无法访问Ollama API
- **解决**: 检查安全组11434端口

## 📞 技术支持

### Ollama专项支持
- 官方文档：https://github.com/ollama/ollama
- 模型库：https://ollama.ai/library

### 阿里云专项支持
- GPU实例：https://www.aliyun.com/product/ecs/gpu
- 云监控：https://cloudmonitor.console.aliyun.com

---

**现在你的Vue3项目具备了完整的AI能力！** 🤖
包含智能对话和语义搜索功能，部署后即可使用。
