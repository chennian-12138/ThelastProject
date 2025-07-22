import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/graph', async (_req, res) => {
  // 1️⃣ 一次性取出所有需要的字段
  const docs = await mongoose.connection.db
    .collection('papers')
    .find(
      { gnn_embedding: { $exists: true } },            // 只拿已嵌入的
      {
        projection: {
          paperId: 1,
          title: 1,
          abstract: 1,
          authors: 1,
          year: 1,
          gnn_embedding: 1,
          references: 1
        }
      }
    )
    .toArray();

  // 2️⃣ 建立 paperId → index 映射
  const id2idx = {};
  docs.forEach((d, i) => (id2idx[d.paperId] = i));

  // 3️⃣ 构造节点
  const nodes = docs.map((d, i) => ({
    id: d.paperId,
    title: d.title || '',
    abstract: d.abstract || '',
    authors: d.authors || [],
    year: d.year || 2020,
    embedding: d.gnn_embedding,
    x: 0,                       // 前端会再随机/力导向
    y: 0,
  }));

  // 4️⃣ 构造 links（索引数组，两边都在库里的才保留）
  const edges = [];
  docs.forEach((d, i) => {
    (d.references || [])
      .map(r => id2idx[r])
      .filter(j => j !== undefined)
      .forEach(j => edges.push({ source: i, target: j }));
  });

  res.json({ nodes, edges });
});

export default router;