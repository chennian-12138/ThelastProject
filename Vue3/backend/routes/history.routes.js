import express from 'express';
import History from '../models/History.js';
import { verifyToken } from '../utils/jwt.utils.js';

const router = express.Router();

// 写入历史记录
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    // 使用JWT中的userId（应该是ObjectId）
    const userId = req.user.userId;
    
    // 创建新的历史记录
    const history = await History.create({ 
      userId, 
      type, 
      data,
      timestamp: new Date()
    });

    res.json({ 
      success: true, 
      message: '历史记录已保存',
      id: history._id 
    });
  } catch (error) {
    console.error('保存历史记录失败:', error);
    res.status(500).json({ message: '保存失败' });
  }
});

// 读取历史记录
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({ message: '缺少类型参数' });
    }

    // 确保用户ID是字符串
    const userId = req.user.userId.toString();
    
    const list = await History.find({ 
      userId, 
      type 
    })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

    res.json(list);
  } catch (error) {
    console.error('读取历史记录失败:', error);
    res.status(500).json({ message: '读取失败' });
  }
});

// 清空历史记录
router.delete('/', verifyToken, async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({ message: '缺少类型参数' });
    }

    // 确保用户ID是字符串
    const userId = req.user.userId.toString();
    
    const result = await History.deleteMany({ 
      userId, 
      type 
    });

    res.json({ 
      success: true, 
      message: '历史记录已清空',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('清空历史记录失败:', error);
    res.status(500).json({ message: '清空失败' });
  }
});

// 获取历史记录统计
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId.toString();
    
    const [chatCount, literatureCount] = await Promise.all([
      History.countDocuments({ userId, type: 'chat' }),
      History.countDocuments({ userId, type: 'literature' })
    ]);

    res.json({
      chat: chatCount,
      literature: literatureCount,
      total: chatCount + literatureCount
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ message: '获取统计失败' });
  }
});

export default router;
