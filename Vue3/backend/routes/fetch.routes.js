import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve('backend/.env') });

const router = express.Router();

// MongoDB连接
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
client.connect().then(() => {
  console.log('MongoDB connected (fetch)');
}).catch(err => {
  console.error('Mongo connect error:', err);
});

// 新API端点：触发文献爬取
router.get('/fetch', async (req, res) => {
  const keyword = req.query.q || '';
  const limit = parseInt(req.query.limit) || 50;
  
  if (!keyword.trim()) {
    return res.status(400).json({ error: '关键词不能为空' });
  }

  try {
    console.log(`收到爬取请求: ${keyword}`);
    
    // 生成统一的session_tag
    const session_tag = `kw_${keyword}_${Date.now()}`;
    
    // 使用Python脚本处理关键词
    // 使用Python脚本处理关键词
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'scripts', 'incremental_fetch_embed.py'),
      keyword,
      session_tag,
      limit.toString()
    ], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    // 发送关键词和session_tag给Python脚本
    pythonProcess.stdin.write(keyword + '\n' + session_tag + '\n');
    pythonProcess.stdin.end();

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString('utf8');
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString('utf8');
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python脚本错误:', errorOutput);
        return res.status(500).json({ 
          error: '文献爬取失败', 
          details: errorOutput 
        });
      }

      try {
        // 从临时表中获取数据
        const tempColl = client.db('vue_papers').collection('temp_graph');
        const docs = await tempColl.find({ session_tag: session_tag }).toArray();
        
        const id2idx = {};
        docs.forEach((d, i) => (id2idx[d.paperId] = i));

        const nodes = docs.map((d, i) => ({
          id: d.paperId,
          title: d.title || '',
          abstract: d.abstract || '',
          authors: d.authors || [],
          year: d.year || 2020,
          embedding: d.gnn_embedding,
          x: 0,
          y: 0
        }));

        const edges = [];
        docs.forEach((d, i) => {
          (d.references || [])
            .map(r => id2idx[r])
            .filter(j => j !== undefined)
            .forEach(j => edges.push({ source: i, target: j }));
        });

        console.log(`爬取完成，返回 ${nodes.length} 个节点`);
        
        res.json({
          status: nodes.length > 0 ? 'success' : 'no_new_papers',
          message: nodes.length > 0 ? `成功处理关键词: ${keyword}` : '未找到文献',
          count: nodes.length,
          session_tag: session_tag,
          nodes: nodes,
          edges: edges
        });
      } catch (error) {
        console.error('获取图数据失败:', error);
        res.status(500).json({ 
          error: '获取图数据失败', 
          details: error.message 
        });
      }
    });

  } catch (error) {
    console.error('触发爬取失败:', error);
    res.status(500).json({ 
      error: '触发爬取失败', 
      details: error.message 
    });
  }
});

// 获取爬取状态
router.get('/fetch/status', async (req, res) => {
  try {
    const papers = client.db('vue_papers').collection('papers');
    const count = await papers.countDocuments({ gnn_embedding: { $exists: true } });
    res.json({
      totalPapers: count,
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
