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

export default router;
