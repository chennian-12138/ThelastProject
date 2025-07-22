import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# 1. 读配置
load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_default_database()
papers = db.papers

# 2. Semantic Scholar API（免费，无需 key）
URL = "https://api.semanticscholar.org/graph/v1/paper/search"
PARAMS = {
    "query": "fruit detection deep learning",
    "fields": "paperId,title,year,authors,references",
    "limit": 100,
}

# 3. 爬取 & 入库
def fetch():
    resp = requests.get(URL, params=PARAMS)
    resp.raise_for_status()
    data = resp.json()
    docs = []
    for p in data.get("data", []):
        docs.append({
            "paperId": p["paperId"],
            "title": p["title"],
            "year": p.get("year"),
            "authors": [a["name"] for a in p.get("authors", [])],
            "references": [r["paperId"] for r in (p.get("references") or [])],        })
    if docs:
        papers.insert_many(docs, ordered=False)
        print(f"✅ 已插入 {len(docs)} 篇文献")
    else:
        print("⚠️ 未检索到数据")

if __name__ == "__main__":
    fetch()