import express from 'express';
import User from '../models/User.js';
import History from '../models/History.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// 更新用户信息
router.put('/user/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { username, email },
      { new: true }
    );

    res.json({ 
      success: true, 
      user: { 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户统计数据
router.get('/user/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const [
      totalSearches,
      totalChats,
      savedPapers,
      graphViews
    ] = await Promise.all([
      History.countDocuments({ userId, type: 'literature' }),
      History.countDocuments({ userId, type: 'chat' }),
      History.countDocuments({ userId, type: 'literature', 'data.saved': true }),
      History.countDocuments({ userId, type: 'literature', 'data.action': 'view_graph' })
    ]);

    res.json({
      totalSearches,
      totalChats,
      savedPapers,
      graphViews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 更新头像
router.post('/user/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    await User.findByIdAndUpdate(decoded.userId, { avatar: avatarUrl });
    
    res.json({ 
      success: true, 
      avatar: avatarUrl 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户最近活动
router.get('/user/activities', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const activities = await History.find({ userId: decoded.userId })
      .sort({ timestamp: -1 })
      .limit(10);

    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      icon: activity.type === 'chat' ? '💬' : '🔍',
      title: activity.type === 'chat' 
        ? `与AI对话: ${activity.data.message?.substring(0, 30)}...`
        : `搜索文献: ${activity.data.query || '文献搜索'}`,
      time: activity.timestamp
    }));

    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
