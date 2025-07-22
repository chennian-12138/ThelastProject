import os, pymongo, faiss, numpy as np, json
client = pymongo.MongoClient(os.getenv("MONGO_URI"))
docs = list(client["vue_papers"].papers.find({"gnn_embedding": {"$exists": True}}))

# 统一裁剪 / 填充到 64
vecs = [d["gnn_embedding"][:64] for d in docs] + \
       [d["gnn_embedding"] + [0]*(64-len(d["gnn_embedding"])) for d in docs if len(d["gnn_embedding"])<64]

vecs = np.array(vecs).astype('float32')
index = faiss.IndexFlatIP(64)
index.add(vecs)
faiss.write_index(index, 'faiss_node.index')
json.dump([d["paperId"] for d in docs], open("ids.json", "w"))
print("✅ 统一 64 维索引完成")