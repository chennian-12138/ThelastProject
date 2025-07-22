import os, json, pymongo, requests, faiss, numpy as np
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import sys
import logging
import uuid
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

if len(docs) == 0:
    # 如果没有数据，创建空的索引
    logger.warning("没有找到带有gnn_embedding的文献，创建空索引")
    vecs = np.array([], dtype='float32').reshape(0, 64)  # 假设维度为64
    index = faiss.IndexFlatIP(64)
else:
    # 检查数据一致性
    valid_docs = []
    for d in docs:
        emb = d.get("gnn_embedding")
        if emb and isinstance(emb, list) and len(emb) == 64:
            valid_docs.append(d)
        else:
            logger.warning(f"跳过无效embedding: paperId={d.get('paperId')}, embedding长度={len(emb) if emb else 'None'}")
    
    if len(valid_docs) == 0:
        logger.warning("没有有效的gnn_embedding数据，创建空索引")
        vecs = np.array([], dtype='float32').reshape(0, 64)
        index = faiss.IndexFlatIP(64)
    else:
        docs = valid_docs
        ids = [d["paperId"] for d in docs]
        vecs = np.array([d["gnn_embedding"] for d in docs]).astype('float32')
        index = faiss.IndexFlatIP(vecs.shape[1])
        index.add(vecs)
        logger.info(f"成功加载 {len(docs)} 篇文献的索引")

# 3. 关键词向量化
def embed(text: str) -> list:
    return requests.post(
        OLLAMA_URL,
        json={"model": MODEL, "prompt": text}
    ).json()["embedding"]

# 4. 文献爬取功能
def fetch_papers(keyword: str, limit: int = 100, session_tag: str = None):
    """调用Python脚本爬取新文献"""
    try:
        # 获取正确的脚本路径
        current_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(current_dir, "incremental_fetch_embed.py")
        
        logger.info(f"调用脚本: {script_path} 关键词: {keyword} session_tag: {session_tag}")
        
        result = subprocess.run([
            sys.executable, 
            script_path,
            keyword,
            session_tag or "",
            str(limit)
        ], 
        text=True,
        capture_output=True,
        cwd=os.path.dirname(current_dir),  # 设置为项目根目录
        encoding='utf-8',
        errors='replace'
        )
        
        if result.returncode == 0:
            logger.info(f"成功爬取关键词: {keyword}")
            logger.info(f"脚本输出: {result.stdout}")
            return True
        else:
            logger.error(f"爬取失败: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"爬取异常: {e}")
        return False

# 5. 获取图数据
def get_graph_data():
    """获取所有文献图数据"""
    docs = list(papers.find({"gnn_embedding": {"$exists": True}}))
    
    if not docs:
        return {"nodes": [], "edges": []}
    
    id2idx = {d["paperId"]: i for i, d in enumerate(docs)}
    
    nodes = [{
        "id": d["paperId"],
        "title": d["title"],
        "authors": d["authors"],
        "year": d["year"],
        "abstract": d.get("abstract", ""),
        "embedding": d["gnn_embedding"],
        "x": 0,
        "y": 0
    } for d in docs]
    
    edges = [
        {"source": id2idx[d["paperId"]], "target": id2idx[r]}
        for d in docs
        for r in d.get("references", [])
        if r in id2idx
    ]
    
    return {"nodes": nodes, "edges": edges}

# 6. FastAPI 路由
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/search")
def search(q: str = Query(...), k: int = 100):
    """基于已有文献的语义搜索"""
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
        "abstract": d.get("abstract", ""),
    } for d in sub_docs]

    edges = [
        {"source": id2idx[d["paperId"]], "target": id2idx[r]}
        for d in sub_docs
        for r in d.get("references", [])
        if r in id2idx
    ]
    return {"nodes": nodes, "edges": edges}

@app.get("/api/fetch")
def fetch(q: str = Query(...), limit: int = Query(100)):
    """触发关键词文献爬取"""
    if not q.strip():
        return {"error": "关键词不能为空"}
    
    logger.info(f"收到爬取请求: {q}")
    
    # 生成统一的session_tag
    session_tag = f"kw_{q}_{uuid.uuid4().hex[:8]}"
    
    # 触发爬取
    success = fetch_papers(q, limit, session_tag)
    
    if success:
        # 返回临时表数据
        docs = list(papers.find({"session_tag": session_tag, "gnn_embedding": {"$exists": True}}))
        
        id2idx = {d["paperId"]: i for i, d in enumerate(docs)}
        nodes = [{
            "id": d["paperId"],
            "title": d.get("title", ""),
            "authors": d.get("authors", []),
            "year": d.get("year", 2020),
            "abstract": d.get("abstract", ""),
            "embedding": d["gnn_embedding"],
            "x": 0,
            "y": 0,
        } for d in docs]
        
        edges = [
            {"source": id2idx[d["paperId"]], "target": id2idx[r]}
            for d in docs
            for r in d.get("references", [])
            if r in id2idx
        ]
        
        return {
            "status": "success",
            "message": f"成功处理关键词: {q}",
            "count": len(nodes),
            "session_tag": session_tag, 
            "nodes": nodes,
            "edges": edges,
        }
    else:
        # 即使爬取失败，也返回当前数据
        graph_data = get_graph_data()
        return {
            "status": "error",
            "message": "文献爬取失败，返回当前数据",
            "count": 0,
            "nodes": graph_data["nodes"],
            "edges": graph_data["edges"]
        }

@app.get("/api/graph")
def graph():
    """获取所有文献图数据"""
    return get_graph_data()

@app.get("/api/fetch/status")
def status():
    """获取系统状态"""
    count = papers.count_documents({"gnn_embedding": {"$exists": True}})
    return {"totalPapers": count, "status": "ready"}

# ---------- 临时图谱接口 ----------
@app.get("/api/temp_graph")
def temp_graph(session: str = Query(...)):
    """仅返回本次 session_tag 的文献子图"""
    logger.info(f"temp_graph 查询 session={session}, 命中 {papers.count_documents({'session_tag': session})} 条")
    docs = list(client["vue_papers"]["temp_graph"].find({"session_tag": session, "gnn_embedding": {"$exists": True}}))
    if not docs:
        return {"nodes": [], "edges": []}

    id2idx = {d["paperId"]: i for i, d in enumerate(docs)}
    nodes = [
        {
            "id": d["paperId"],
            "title": d.get("title", ""),
            "authors": d.get("authors", []),
            "year": d.get("year", 2020),
            "abstract": d.get("abstract", ""),
            "embedding": d["gnn_embedding"],
            "x": 0,
            "y": 0,
        }
        for d in docs
    ]
    edges = [
        {"source": id2idx[d["paperId"]], "target": id2idx[r]}
        for d in docs
        for r in d.get("references", [])
        if r in id2idx
    ]
    for d in docs:
        refs = [id2idx[r] for r in d.get("references", []) if r in id2idx]
        predicted = d.get("predicted_edges", [])
        similarity = d.get("similarity_edges", [])
        edges.extend([{"source": id2idx[d["paperId"]], "target": t} for t in refs])
        edges.extend([{"source": id2idx[s], "target": id2idx[t]} for s, t in predicted + similarity])    
    return {"nodes": nodes, "edges": edges}

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

# 简单内存历史（演示用）
chat_hist: list = []
lit_hist: list = []

@app.post("/api/history")
def save_history(request: Request):
    body = request.json()
    typ = body.get("type")
    data = body.get("data")
    if typ == "chat":
        chat_hist.append(data)
    else:
        lit_hist.append(data)
    return {"ok": True}

@app.get("/api/history")
def load_history(type: str = Query(...)):
    return chat_hist if type == "chat" else lit_hist

@app.delete("/api/history")
def clear_history(type: str = Query(...)):
    if type == "chat":
        chat_hist.clear()
    else:
        lit_hist.clear()
    return {"ok": True}

# 7. 一键启动
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
