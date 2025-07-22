import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 12;

/* 注册 */
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '缺少字段' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: '邮箱已注册' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hash });

    res.status(201).json({ message: '注册成功', user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

/* 登录 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '缺少字段' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: '用户不存在' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: '密码错误' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
};