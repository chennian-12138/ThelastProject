import express from 'express';
import History from '../models/History.js';
import { verifyToken } from '../utils/jwt.utils.js';

const router = express.Router();

// 写入
router.post('/', verifyToken, async (req, res) => {
  const { type, data } = req.body;
  await History.create({ userId: req.user.userId, type, data });
  res.json({ ok: true });
});

// 读取
router.get('/', verifyToken, async (req, res) => {
  const { type } = req.query;
  const list = await History.find({ userId: req.user.userId, type })
                            .sort({ timestamp: -1 })
                            .limit(100);
  res.json(list);
});

// 清空
router.delete('/', verifyToken, async (req, res) => {
  const { type } = req.query;
  await History.deleteMany({ userId: req.user.userId, type });
  res.json({ ok: true });
});

export default router;