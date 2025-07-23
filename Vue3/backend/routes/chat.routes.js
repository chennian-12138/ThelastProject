import express from 'express';
import { authenticateToken } from '../utils/jwt.utils.js';
import History from '../models/History.js';

const router = express.Router();

// 对话接口
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.userId.toString();

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: '请输入有效的问题' });
    }

    // 调用Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'my_ds_for_test/deepseek-r1',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error('Ollama服务响应异常');
    }

    const data = await ollamaResponse.json();
    const fullResponse = data.response;

    // 解析思考内容和最终回复
    const thinkRegex = /<think>(.*?)<\/think>/s;
    const match = fullResponse.match(thinkRegex);
    
    let thinkContent = '';
    let finalText = fullResponse;

    if (match) {
      thinkContent = match[1].trim();
      finalText = fullResponse.replace(thinkRegex, '').trim();
    }

    // 保存到历史记录
    const historyEntry = new History({
      userId: req.user.userId, // 直接使用JWT中的userId（应该是ObjectId）
      type: 'chat',
      data: {
        role: 'bot',
        text: finalText,
        think: thinkContent,
        prompt: prompt,
        timestamp: Date.now()
      }
    });

    await historyEntry.save();

    res.json({
      text: finalText,
      think: thinkContent,
      success: true
    });

  } catch (error) {
    console.error('对话处理错误:', error);
    
    // 更详细的错误处理
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'AI服务未启动，请确保Ollama服务正在运行',
        success: false 
      });
    }
    
    if (error.message.includes('fetch')) {
      return res.status(503).json({ 
        message: '无法连接到AI服务，请检查Ollama是否运行',
        success: false 
      });
    }
    
    if (error.message.includes('Ollama')) {
      return res.status(503).json({ 
        message: 'AI服务暂时不可用，请稍后重试',
        success: false 
      });
    }
    
    res.status(500).json({ 
      message: `处理请求时发生错误: ${error.message}`,
      success: false 
    });
  }
});

// 获取对话历史
router.get('/chat/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId.toString();
    const limit = parseInt(req.query.limit) || 50;
    
    const history = await History.find({ 
      userId: req.user.userId, 
      type: 'chat' 
    })
    .sort({ 'data.timestamp': -1 })
    .limit(limit);

    res.json({
      history: history.map(item => item.data),
      success: true
    });

  } catch (error) {
    console.error('获取历史记录错误:', error);
    res.status(500).json({ 
      message: '获取历史记录失败',
      success: false 
    });
  }
});

export default router;
