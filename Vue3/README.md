# Vue3

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

```
Vue3
├─ backend
│  ├─ app.js
│  ├─ controllers
│  │  └─ auth.controller.js
│  ├─ models
│  │  └─ User.js
│  ├─ routes
│  │  ├─ auth.routes.js
│  │  ├─ graph.routes.js
│  │  ├─ health.routes.js
│  │  └─ search.routes.js
│  ├─ test-mongo.cjs
│  ├─ test-mongo.js
│  └─ utils
│     └─ jwt.utils.js
├─ env.d.ts
├─ faiss.index
├─ ids.json
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ DeepSeek-r1.jpg
│  ├─ favicon.ico
│  └─ 头像.png
├─ query
├─ README.md
├─ scripts
│  ├─ embeddings.json
│  ├─ fetch_papers.py
│  ├─ gnn.py
│  ├─ ids.json
│  ├─ Mongo.py
│  ├─ rebuild_64.py
│  └─ semantic_search.py
├─ src
│  ├─ AllCode.txt
│  ├─ App.vue
│  ├─ assets
│  │  ├─ scripts
│  │  │  └─ App.js
│  │  └─ styles
│  │     ├─ App.css
│  │     └─ bot_test.css
│  ├─ components
│  │  ├─ LiteratureGraph.vue
│  │  ├─ LoginForm.vue
│  │  └─ RegisterForm.vue
│  ├─ main.ts
│  ├─ pages
│  │  ├─ about_ourselves.vue
│  │  ├─ bot_test.vue
│  │  ├─ history.vue
│  │  ├─ home.vue
│  │  └─ send.png
│  ├─ ProjectTree.txt
│  ├─ router
│  │  └─ index.ts
│  └─ store
│     └─ history.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
```
Vue3
├─ all-code.txt
├─ backend
│  ├─ app.js
│  ├─ controllers
│  │  └─ auth.controller.js
│  ├─ models
│  │  └─ User.js
│  ├─ routes
│  │  ├─ auth.routes.js
│  │  ├─ graph.routes.js
│  │  ├─ health.routes.js
│  │  └─ search.routes.js
│  ├─ test-mongo.cjs
│  ├─ test-mongo.js
│  └─ utils
│     └─ jwt.utils.js
├─ dump_all_code.mjs
├─ env.d.ts
├─ faiss.index
├─ ids.json
├─ index.html
├─ package-lock.json
├─ package.json
├─ ProjectTree.txt
├─ public
│  ├─ DeepSeek-r1.jpg
│  ├─ favicon.ico
│  └─ 头像.png
├─ query
├─ README.md
├─ scripts
│  ├─ embeddings.json
│  ├─ faiss_node.index
│  ├─ fetch_papers.py
│  ├─ gnn.py
│  ├─ ids.json
│  ├─ incremental_fench_embed.py
│  ├─ Mongo.py
│  ├─ rebuild_64.py
│  ├─ semantic_search.py
│  └─ __pycache__
│     └─ semantic_search.cpython-311.pyc
├─ src
│  ├─ AllCode.txt
│  ├─ App.vue
│  ├─ assets
│  │  ├─ scripts
│  │  │  └─ App.js
│  │  └─ styles
│  │     ├─ App.css
│  │     └─ bot_test.css
│  ├─ components
│  │  ├─ LiteratureGraph.vue
│  │  ├─ LoginForm.vue
│  │  └─ RegisterForm.vue
│  ├─ main.ts
│  ├─ pages
│  │  ├─ about_ourselves.vue
│  │  ├─ bot_test.vue
│  │  ├─ history.vue
│  │  ├─ home.vue
│  │  └─ send.png
│  ├─ router
│  │  └─ index.ts
│  └─ store
│     └─ history.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```