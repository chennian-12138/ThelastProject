import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/temp_graph', async (req, res) => {
  const { session } = req.query;
  if (!session) return res.json({ nodes: [], edges: [] });

  const docs = await mongoose.connection.db
    .collection('temp_graph')
    .find({ session_tag: session })
    .toArray();

  const id2idx = {};
  docs.forEach((d, i) => (id2idx[d.paperId] = i));

  const nodes = docs.map((d) => ({
    id: d.paperId,
    title: d.title || '',
    authors: d.authors || [],
    year: d.year || 2020,
    abstract: d.abstract || '',
    embedding: d.gnn_embedding,
    x: 0, y: 0,
  }));
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
