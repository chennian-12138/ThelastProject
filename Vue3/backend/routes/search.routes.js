import express from 'express';
import faiss from 'faiss-node';          // npm i faiss-node
import fs from 'fs';
import { IndexFlatIP } from 'faiss-node';
const router = express.Router();

const index = new IndexFlatIP(64);
index.read('faiss.index');
const ids   = JSON.parse(fs.readFileSync('ids.json', 'utf-8'));

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