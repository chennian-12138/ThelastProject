import torch, os, numpy as np, torch.nn as nn
from pymongo import MongoClient
from torch_geometric.data import Data
from torch_geometric.nn import LightGCN
from sklearn.model_selection import train_test_split
from dotenv import load_dotenv
from torch_geometric.nn import GCNConv   # ← 新增
import json, os

class GCNClassifier(nn.Module):
    def __init__(self, in_dim, hidden_dim, num_classes):
        super().__init__()
        self.conv1 = GCNConv(in_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.lin = nn.Linear(hidden_dim, num_classes)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index).relu()
        return self.lin(x)
    
load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
papers = client.get_default_database().papers

# 1️⃣ 拿全部 100 篇文献
docs = list(papers.find({"embedding": {"$exists": True}},
                        {"paperId": 1, "embedding": 1, "year": 1, "references": 1}))
num_nodes = len(docs)
id2idx = {d["paperId"]: i for i, d in enumerate(docs)}   # 0~99 连续整数

missing = 0
for d in docs:
    for rid in (d.get("references") or []):
        if rid not in id2idx:
            missing += 1
# print("missing references:", missing)

# 2️⃣ 构造边（仅保留两端都在 id2idx 里的引用）
edge_index = []
for i, d in enumerate(docs):
    for rid in (d.get("references") or []):
        j = id2idx.get(rid)
        if j is not None:
            edge_index.append([i, j])
edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()
# 补自环，确保所有 100 个节点都有连接
self_loops = torch.arange(num_nodes).repeat(2, 1)
edge_index = torch.cat([edge_index, self_loops], dim=1)

# print("total edges:", len(edge_index))

# 3️⃣ 特征 & 标签
x = torch.tensor([d["embedding"] for d in docs], dtype=torch.float)  # (100,384)
y = torch.tensor([d.get("year", 2020) for d in docs], dtype=torch.long)

# 4️⃣ 数据集划分
train_idx, test_idx = train_test_split(range(num_nodes), test_size=0.2, random_state=42)
train_mask = torch.zeros(num_nodes, dtype=torch.bool); train_mask[train_idx] = True
test_mask  = torch.zeros(num_nodes, dtype=torch.bool); test_mask[test_idx] = True

with torch.no_grad():          # ← 关键：不保留梯度
    proj = nn.Linear(384, 64)
    x = proj(x)                # (100,64) 直接算完

data = Data(x=x, edge_index=edge_index, y=y,
            train_mask=train_mask, test_mask=test_mask)

# print("edge_index shape:", data.edge_index.shape)
# print("num_nodes:", num_nodes)

# 5️⃣ 训练
num_classes = y.max().item() + 1
model = GCNClassifier(in_dim=64, hidden_dim=64, num_classes=num_classes)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

for epoch in range(100):
    out = model(data.x, data.edge_index)
    loss = nn.functional.cross_entropy(out[data.train_mask], data.y[data.train_mask])
    optimizer.zero_grad(); loss.backward(); optimizer.step()
    if epoch % 10 == 0:
        print(f"epoch {epoch}  loss {loss.item():.4f}")

# 6️⃣ 保存 64 维 GNN 嵌入
with torch.no_grad():
    emb = model(data.x, data.edge_index).cpu().numpy()
for i, d in enumerate(docs):
    papers.update_one({"paperId": d["paperId"]},
                      {"$set": {"gnn_embedding": emb[i].tolist()}})
print("✅ GNN 训练完成，100 篇文献全部拿到 64 维嵌入")

# 7️⃣ 导出给前端（清洗版）
docs_with_emb = list(papers.find({"gnn_embedding": {"$exists": True}}))

import re
def clean_str(s):
    if not isinstance(s, str):
        return s
    # 统一英文双引号，去掉多余符号
    s = re.sub(r'[“”]', '"', s)
    s = re.sub(r'[‘’]', "'", s)
    s = re.sub(r'[，]', ',', s)
    return s.strip()

graph_json = []
for d in docs_with_emb:
    # 确保字段存在且类型正确
    title   = clean_str(d.get("title", ""))
    authors = [clean_str(a) for a in d.get("authors", []) if a]
    year    = int(d.get("year", 2020))
    refs    = [id2idx[r] for r in d.get("references", []) if r in id2idx]

    graph_json.append({
        "id": d["paperId"],
        "title": title,
        "abstract": clean_str(d.get("abstract", "")),
        "authors": authors,
        "year": year,
        "embedding": d["gnn_embedding"],
        "x": 0,
        "y": 0,
        "links": refs
    })

# 输出到 public/graph.json
import pathlib, json
pathlib.Path("public").mkdir(exist_ok=True)
with open("public/graph.json", "w", encoding="utf-8") as f:
    json.dump(graph_json, f, ensure_ascii=False, indent=2)

print("✅ graph.json 已生成，共", len(graph_json), "条记录")