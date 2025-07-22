#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
完全基于Semantic Scholar的文献搜索和引用网络构建
1. 直接在Semantic Scholar搜索文献
2. 获取文献的参考文献
3. 构建引用网络图
"""
import json, torch.nn as nn, os, time, pymongo, requests, faiss, numpy as np, torch
import sys
import subprocess
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from dotenv import load_dotenv
import logging
import uuid

# 设置默认编码为UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

logging.basicConfig(level=logging.INFO, encoding='utf-8')
logger = logging.getLogger(__name__)
load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client["vue_papers"]
papers = db["papers"]
temp_coll = db["temp_graph"]
# 30 分钟 TTL 索引
temp_coll.create_index("expireAt", expireAfterSeconds=0)

class GCN64(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = GCNConv(768, 128)
        self.conv2 = GCNConv(128, 64)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        return self.conv2(x, edge_index)

def search_semantic_scholar(keyword: str, limit=200):
    """在Semantic Scholar搜索文献"""
    try:
        headers = {"x-api-key": "c63DAMcxwa3Y4OeGlYgDP6jZXpneZABL2sGAc8og"}
        
        search_url = "https://api.semanticscholar.org/graph/v1/paper/search"
        search_params = {
            "query": keyword,
            "publicationTypes": "Review",
            "limit": 1,
            "fields": "paperId,title,authors,year,abstract,references"
        }
        
        search_response = requests.get(search_url, headers=headers, params=search_params)
        if search_response.status_code != 200:
            return None
        
        search_data = search_response.json()
        if not search_data.get("data"):
            return None
        
        return search_data["data"][0]
        
    except Exception as e:
        logger.error(f"Semantic Scholar搜索失败: {e}")
        return None

def get_references_from_paper(paper_id: str, limit=200):
    """从Semantic Scholar文献获取参考文献"""
    all_refs, offset = [], 0
    try:
        headers = {"x-api-key": "c63DAMcxwa3Y4OeGlYgDP6jZXpneZABL2sGAc8og"}
        
        paper_url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references"
        paper_params = {
            "fields": "paperId,title,authors,year,abstract",
            "limit": min(100, limit - len(all_refs)),
            "offset": offset
        }
        
        paper_response = requests.get(paper_url, headers=headers, params=paper_params)
        if paper_response.status_code != 200:
            return []
        
        paper_data = paper_response.json()
        references = paper_data.get("data", [])
        
        results = []
        for ref in references:
            authors = [author.get("name", "") for author in ref.get("authors", [])]
            results.append({
                "paperId": ref.get("paperId", str(uuid.uuid4())),
                "title": ref.get("title", ""),
                "year": ref.get("year", 2020),
                "authors": authors,
                "abstract": ref.get("abstract", ""),
                "references": []
            })
        
        return results
        
    except Exception as e:
        logger.error(f"获取参考文献失败: {e}")
        return []

def fetch_based_on_semantic_scholar(keyword: str, limit=200, session_tag: str = None):
    """基于Semantic Scholar构建引用网络"""
    try:
        # 1. 搜索中心文献
        center_paper = search_semantic_scholar(keyword, limit)
        if not center_paper:
            logger.warning("Semantic Scholar未找到文献")
            return []
        
        paper_id = center_paper["paperId"]
        paper_title = center_paper["title"]
        
        # 2. 获取参考文献
        references = get_references_from_paper(paper_id, limit=limit)

        # 3. 构建中心节点
        authors = [author.get("name", "") for author in center_paper.get("authors", [])]
        center_doc = {
            "paperId": paper_id,
            "title": paper_title,
            "year": center_paper.get("year", 2020),
            "authors": authors,
            "abstract": center_paper.get("abstract", ""),
            "references": [ref["paperId"] for ref in references],
            "session_tag": session_tag,
            "is_center": True
        }
        temp_coll.insert_many(results)   # 这一行已存在，但之前只插入了 references，现在把 center_doc 也一起插入
        results.append(center_doc)
        
        # 4. 组合结果
        results = [center_doc] + references
        
        return results
        
    except Exception as e:
        logger.error(f"Semantic Scholar构建网络失败: {e}")
        return []

def fetch_semantic_scholar_batch(keyword: str, limit=200, session_tag: str = None):
    """批量Semantic Scholar搜索作为fallback"""
    try:
        headers = {"x-api-key": "c63DAMcxwa3Y4OeGlYgDP6jZXpneZABL2sGAc8og"}
        
        search_url = "https://api.semanticscholar.org/graph/v1/paper/search"
        search_params = {
            "query": keyword,
            "limit": limit,
            "fields": "paperId,title,authors,year,abstract"
        }
        
        search_response = requests.get(search_url, headers=headers, params=search_params)
        if search_response.status_code != 200:
            return []
        
        search_data = search_response.json()
        papers = search_data.get("data", [])
        
        results = []
        for paper in papers:
            authors = [author.get("name", "") for author in paper.get("authors", [])]
            results.append({
                "paperId": paper.get("paperId", str(uuid.uuid4())),
                "title": paper.get("title", ""),
                "year": paper.get("year", 2020),
                "authors": authors,
                "abstract": paper.get("abstract", ""),
                "references": [],
                "session_tag": session_tag
            })
        
        return results
        
    except Exception as e:
        logger.error(f"批量搜索失败: {e}")
        return []

def process_keyword(keyword: str, limit=200, session_tag=None):
    """主流程：基于Semantic Scholar构建引用网络"""
    try:
        new_docs = fetch_based_on_semantic_scholar(keyword, limit, session_tag)
        if not new_docs:
            logger.warning("使用批量搜索作为fallback")
            new_docs = fetch_semantic_scholar_batch(keyword, limit, session_tag)
        
        if not new_docs:
            return {"status": "no_new_papers", "count": 0}
        
        # 创建节点映射
        paper_ids = [d["paperId"] for d in new_docs]
        id_to_idx = {pid: idx for idx, pid in enumerate(paper_ids)}
        
        # 构建边索引（主文献引用所有参考文献）
        edge_index = []
        main_paper_idx = 0  # 主文献是第一个
        for i, paper in enumerate(new_docs[1:], 1):  # 跳过主文献
            edge_index.append([i, main_paper_idx])  # 参考文献 -> 主文献
        
        # 向量化
        for d in new_docs:
            vec = requests.post(
                "http://localhost:11434/api/embeddings",
                json={"model": "nomic-embed-text", "prompt": d["title"]}
            ).json()["embedding"]
            d["embedding"] = vec
            d["gnn_embedding"] = vec[:64]
            d["session_tag"] = session_tag
            d["expireAt"] = time.time() + 30*60

        # 写入临时表
        temp_coll.insert_many(new_docs)

        # 更新索引
        vec64 = np.array([d["gnn_embedding"] for d in new_docs], dtype='float32')
        try:
            index = faiss.read_index("scripts/faiss_node.index")
        except:
            index = faiss.IndexFlatIP(64)
        index.add(vec64)
        faiss.write_index(index, "scripts/faiss_node.index")

        # 执行GNN训练
        try:
            subprocess.run([
                sys.executable, 
                os.path.join(os.path.dirname(__file__), 'dynamic_gnn.py'),
                session_tag
            ], check=True, timeout=300)
            logger.info("GNN训练完成")
        except Exception as e:
            logger.error(f"GNN训练失败: {e}")

        logger.info(f"新增 {len(new_docs)} 篇文献（基于Semantic Scholar）")
        return {"status": "success", "count": len(new_docs), "session_tag": session_tag}
        
    except Exception as e:
        logger.error(f"处理关键词时出错: {e}")
        return {"status": "error", "error": str(e)}

# 供命令行测试
if __name__ == "__main__":
    if len(sys.argv) >= 3:
        keyword, session_tag = sys.argv[1], sys.argv[2]
        limit = int(sys.argv[3]) if len(sys.argv) >= 4 else 200
        print(json.dumps(process_keyword(keyword, limit, session_tag), ensure_ascii=False))
    else:
        kw = input("输入关键词：")
        session_tag = str(uuid.uuid4())
        print(process_keyword(kw, 200, session_tag))
