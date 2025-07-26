import express from 'express';
import User from '../models/User.js';
import History from '../models/History.js';
import Visit from '../models/Visit.js';  // 新增导入

const router = express.Router();

// 获取实时统计数据
router.get('/stats', async (req, res) => {
  try {
    const [
      userCount,
      chatCount,
      literatureSearchCount,
      visitRecord
    ] = await Promise.all([
      User.countDocuments(),
      History.countDocuments({ type: 'chat' }),
      History.countDocuments({ type: 'literature' }), // 简化为只统计 type 为 literature 的记录
      Visit.findOne().sort({ date: -1 })
    ]);

    res.json({
      users: userCount,
      chats: chatCount,
      searches: literatureSearchCount,
      visits: visitRecord ? visitRecord.count : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 记录访问
router.post('/visit', async (req, res) => {
  try {
    let visitRecord = await Visit.findOne();
    if (visitRecord) {
      visitRecord.count += 1;
      await visitRecord.save();
    } else {
      visitRecord = new Visit({ count: 1 });
      await visitRecord.save();
    }
    res.json({ success: true, visits: visitRecord.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
