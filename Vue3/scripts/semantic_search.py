import os, json, pymongo, requests, faiss, numpy as np
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# 0. 环境
MONGO_URI = os.getenv("MONGO_URI")
OLLAMA_URL = "http://localhost:11434/api/embeddings"
MODEL = "nomic-embed-text"

# 1. Mongo 连接
client = pymongo.MongoClient(MONGO_URI)
papers = client["vue_papers"].papers

# 2. 一次性载入索引（启动时跑一次）
docs = list(papers.find({"gnn_embedding": {"$exists": True}}))
ids  = [d["paperId"] for d in docs]
vecs = np.array([d["gnn_embedding"] for d in docs]).astype('float32')
index = faiss.IndexFlatIP(vecs.shape[1])
index.add(vecs)

# 3. 关键词向量化
def embed(text: str) -> list:
    return requests.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": text}
    ).json()["embedding"]

# 4. FastAPI 路由
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/api/search")
def search(q: str = Query(...), k: int = 50):
    embed_vec = embed(q)[:64]
    if len(embed_vec) != index.d:
        return {"error": f"维度不匹配：查询 {len(embed_vec)} vs 索引 {index.d}"}
    vec = np.array([embed_vec], dtype='float32')
    _, labels = index.search(vec, k)

    top_k = [docs[i] for i in labels[0]]
    paper_set = {d["paperId"] for d in top_k}
    for d in top_k:
        paper_set.update(d.get("references", []))

    sub_docs = [d for d in docs if d["paperId"] in paper_set]
    id2idx = {d["paperId"]: i for i, d in enumerate(sub_docs)}

    nodes = [{
        "id": d["paperId"],
        "title": d["title"],
        "authors": d["authors"],
        "year": d["year"],
    } for d in sub_docs]

    edges = [
        {"source": id2idx[d["paperId"]], "target": id2idx[r]}
        for d in sub_docs
        for r in d.get("references", [])
        if r in id2idx
    ]
    return {"nodes": nodes, "edges": edges}

# 5. 一键启动
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
