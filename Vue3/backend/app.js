import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import graphRoutes from './routes/graph.routes.js';
import searchRoutes from './routes/search.routes.js';
import historyRoutes from './routes/history.routes.js';
import fetchRoutes from './routes/fetch.routes.js';
import tempGraphRoutes from './routes/temp_graph.routes.js';
import chatRoutes from './routes/chat.routes.js';
import statsRoutes from './routes/stats.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

/* ---------- 中间件 ---------- */
app.use(cors({ origin: true, credentials: true })); // 生产环境换成具体域名
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));


/* ---------- 数据库 ---------- */
await mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vue_papers')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/* ---------- 路由 ---------- */
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);
app.use('/api', graphRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', fetchRoutes);
app.use('/api/history', historyRoutes);
app.use('/api', tempGraphRoutes);
app.use('/api', chatRoutes);
app.use('/api', statsRoutes);
app.use('/api', userRoutes);

console.log('✅ /api/temp_graph 路由已注册');
console.log('✅ /api/chat 路由已注册');
console.log('✅ /api/stats 路由已注册');

/* ---------- 统一错误处理 ---------- */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || '内部服务器错误',
  });
});

/* ---------- 启动 ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
