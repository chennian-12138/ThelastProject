import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/jwt.utils.js';

const router = Router();

// 注册
router.post('/register', register);

// 登录
router.post('/login', login);

// 登出
router.post('/logout', verifyToken, logout);

// 获取用户信息
router.get('/me', verifyToken, getProfile);

// 添加获取当前用户信息的路由
router.get('/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未登录' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
