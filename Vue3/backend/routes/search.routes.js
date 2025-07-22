import express from 'express';
import pkg from 'faiss-node';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('backend/.env') });


const { IndexFlatIP } = pkg;
const router = express.Router();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI not found in env');
  process.exit(1);
}


const client = new MongoClient(uri);
client.connect().then(() => {
  console.log('MongoDB connected (search)');
}).catch(err => {
  console.error('Mongo connect error:', err);
  process.exit(1);
});
const papers = client.db('vue_papers').collection('papers');

// 一次性取出所有已嵌入的文档
const docs = await papers.find({ gnn_embedding: { $exists: true } }).toArray();
// 下面保持你原来的逻辑即可
// 本地 Ollama 向量化
async function embed(text) {
  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text })
  });
  return (await res.json()).embedding;
}

router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const vec = await embed(q);
  const qVec = new Float32Array(vec);
  const { distances, labels } = index.search(qVec, 50);   // Top-50

  // 取 50 篇 + 1 跳引用
  const paperSet = new Set(labels.map(i => ids[i]));
  docs.forEach(d => {
    if (paperSet.has(d.paperId)) {
      (d.references || []).forEach(r => paperSet.add(r));
    }
  });

  const subDocs = docs.filter(d => paperSet.has(d.paperId));
  const id2idx = {};
  subDocs.forEach((d, i) => (id2idx[d.paperId] = i));

  const nodes = subDocs.map((d, i) => ({
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
  subDocs.forEach((d, i) => {
    (d.references || [])
      .map(r => id2idx[r])
      .filter(j => j !== undefined)
      .forEach(j => edges.push({ source: i, target: j }));
  });

  res.json({ nodes, edges });
});

export default router;