import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 12;

/* 注册 */
export const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码为必填项' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '密码长度至少为6位' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: '邮箱已注册' });
    }

    // 检查用户名是否已存在
    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(409).json({ message: '用户名已存在' });
      }
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ 
      email, 
      password: hash,
      username: username || undefined
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
};

/* 登录 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码为必填项' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '用户不存在或密码错误' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: '用户不存在或密码错误' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
};

/* 登出 */
export const logout = async (req, res, next) => {
  try {
    // 这里可以添加令牌黑名单逻辑
    res.json({ message: '登出成功' });
  } catch (err) {
    next(err);
  }
};

/* 获取用户信息 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
};
