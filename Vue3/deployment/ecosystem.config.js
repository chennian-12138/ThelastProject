// PM2配置文件 - 用于管理Node.js后端进程
module.exports = {
  apps: [
    {
      name: 'vue-papers-backend',
      script: 'backend/app.js',
      cwd: '/www/wwwroot/your-domain.com',  // 替换为你的实际路径
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGO_URI: 'mongodb://localhost:27017/vue_papers_prod',
        JWT_SECRET: 'your-jwt-secret-key-change-this',
        OLLAMA_HOST: 'localhost:11434',
        OLLAMA_MODEL: 'my_ds_for_test/deepseek-r1',
        EMBEDDING_MODEL: 'nomic-embed-text',
        // 其他环境变量
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGO_URI: 'mongodb://localhost:27017/vue_papers_prod',
        JWT_SECRET: 'your-jwt-secret-key-change-this',
        OLLAMA_HOST: 'localhost:11434',
        OLLAMA_MODEL: 'my_ds_for_test/deepseek-r1',
        EMBEDDING_MODEL: 'nomic-embed-text',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      // 自动重启配置
      min_uptime: '10s',
      max_restarts: 5,
      restart_delay: 4000,
      // 监控配置
      monitoring: false,
      // 端口检查
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ]
};
