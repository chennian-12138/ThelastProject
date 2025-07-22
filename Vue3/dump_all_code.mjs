#!/usr/bin/env node
/*
 * dump-all-code.mjs  ——  ESM 版本
 * 一键收集本项目所有重要源码到 all-code.txt
 * 运行: node dump-all-code.mjs
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. 根据最新目录树列出的「相对路径」
const FILES = [
  // backend
  'backend/app.js',
  'backend/controllers/auth.controller.js',
  'backend/models/User.js',
  'backend/routes/auth.routes.js',
  'backend/routes/graph.routes.js',
  'backend/routes/health.routes.js',
  'backend/routes/search.routes.js',
  'backend/test-mongo.cjs',
  'backend/test-mongo.js',
  'backend/utils/jwt.utils.js',

  // 根目录
  'env.d.ts',
  'package.json',
  'README.md',
  'index.html',

  // scripts
  'scripts/fetch_papers.py',
  'scripts/gnn.py',
  'scripts/Mongo.py',
  'scripts/rebuild_64.py',
  'scripts/semantic_search.py',
  'scripts/embeddings.json',
  'scripts/ids.json',

  // src
  'src/main.ts',
  'src/App.vue',
  'src/router/index.ts',
  'src/store/history.ts',
  'src/components/LiteratureGraph.vue',
  'src/components/LoginForm.vue',
  'src/components/RegisterForm.vue',
  'src/pages/about_ourselves.vue',
  'src/pages/bot_test.vue',
  'src/pages/history.vue',
  'src/pages/home.vue',
  'src/assets/scripts/App.js',
  'src/assets/styles/App.css',
  'src/assets/styles/bot_test.css',

  // 配置
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'vite.config.ts'
];

const OUT_FILE = 'all-code.txt';

(async () => {
  const out = fs.createWriteStream(path.resolve(__dirname, OUT_FILE), { flags: 'w' });

  out.write(`Project Full Code Dump\n`);
  out.write(`Generated: ${new Date().toISOString()}\n`);
  out.write(`Project Root: ${process.cwd()}\n\n`);

  for (const rel of FILES) {
    const abs = path.resolve(__dirname, rel);
    if (!fs.existsSync(abs)) {
      out.write(`\n===== ${rel} =====\n⚠️ 文件不存在，跳过\n\n`);
      continue;
    }

    try {
      const stat = await fs.promises.stat(abs);
      if (!stat.isFile()) continue;

      const content = await fs.promises.readFile(abs, 'utf8');
      out.write(`\n===== ${rel} =====\n\n`);
      out.write(content + '\n');
    } catch (e) {
      out.write(`\n===== ${rel} =====\n⚠️ 读取失败: ${e.message}\n\n`);
    }
  }

  out.end();
  console.log(`✅ 已生成 ${OUT_FILE} (${path.resolve(__dirname, OUT_FILE)})`);
})();