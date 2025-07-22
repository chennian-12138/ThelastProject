import { Router } from 'express';
const router = Router();

router.get('/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date(), env: process.env.NODE_ENV })
);

export default router;