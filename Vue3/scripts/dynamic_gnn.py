import torch, os, numpy as np, torch.nn.functional as F, pymongo, sys
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client["vue_papers"]
temp_coll = db["temp_graph"]

session_tag = sys.argv[1]
docs = list(temp_coll.find({"session_tag": session_tag}))
if not docs:
    print("no docs for session", session_tag)
    sys.exit(0)

ids = [d["paperId"] for d in docs]
id2idx = {pid: i for i, pid in enumerate(ids)}
x = torch.tensor([d["gnn_embedding"] for d in docs], dtype=torch.float)
num_nodes = len(docs)

# === 构造 edge_index：完全复用 gnn.py 的逻辑 ===
edge_index = []
for i, d in enumerate(docs):
    for rid in (d.get("references") or []):
        j = id2idx.get(rid)
        if j is not None:
            edge_index.append([i, j])
edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()

# 在 edge_index = torch.tensor(...).t().contiguous() 后面直接加
if edge_index.numel() == 0:                       # 空图检测
    edge_index = torch.arange(num_nodes).repeat(2, 1)  # (2, N) 自环

# 空图兜底
if edge_index.size(1) == 0:
    edge_index = torch.arange(num_nodes).repeat(2, 1)  # (2, N) 自环

print("abc", edge_index.size(1))

data = Data(x=x, edge_index=edge_index)

# 2. 链接预测 GCN
class Net(torch.nn.Module):
    def __init__(self, in_channels, hidden):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden)
        self.conv2 = GCNConv(hidden, hidden)

    def encode(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        return self.conv2(x, edge_index)

    def decode(self, z, edge_label_index):
        return (z[edge_label_index[0]] * z[edge_label_index[1]]).sum(dim=-1)

device = torch.device('cpu')
model = Net(data.x.size(1), 64).to(device)
data = data.to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# 构造正/负样本
def get_link_labels(pos_edge_index, neg_edge_index):
    E = pos_edge_index.size(1) + neg_edge_index.size(1)
    link_labels = torch.zeros(E, device=device)
    link_labels[:pos_edge_index.size(1)] = 1.
    return link_labels

def negative_sampling(edge_index, num_nodes, num_neg_samples):
    idx = edge_index.to('cpu').numpy()
    existing = set(map(tuple, idx.T))
    neg_samples = []
    while len(neg_samples) < num_neg_samples:
        i, j = np.random.randint(0, num_nodes, 2)
        if i != j and (i, j) not in existing:
            neg_samples.append([i, j])
    return torch.tensor(neg_samples, dtype=torch.long).t().contiguous().to(device)

# 3. 训练
for epoch in range(100):
    model.train()
    z = model.encode(data.x, data.edge_index)

    neg_edge_index = negative_sampling(data.edge_index, num_nodes, data.edge_index.size(1))
    edge_label_index = torch.cat([data.edge_index, neg_edge_index], dim=1)
    edge_labels = get_link_labels(data.edge_index, neg_edge_index)

    logits = model.decode(z, edge_label_index)
    loss = F.binary_cross_entropy_with_logits(logits, edge_labels)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    if epoch % 20 == 0:
        print(f'Epoch {epoch:03d}, Loss: {loss:.4f}')

# 4. 预测新边
model.eval()
with torch.no_grad():
    z = model.encode(data.x, data.edge_index)
# 计算所有节点对的余弦相似度并取高置信度
threshold = 0.95  # 可按需要调整
predicted_edges = []
for i in range(num_nodes):
    for j in range(i + 1, num_nodes):
        score = torch.cosine_similarity(z[i].unsqueeze(0), z[j].unsqueeze(0)).item()
        if score > threshold:
            predicted_edges.append([ids[i], ids[j]])

# 5. 计算相似度矩阵
emb = np.array([d["gnn_embedding"] for d in docs])
sim = cosine_similarity(emb)
threshold = 0.8

sim_flat = [(i, j, sim[i, j]) for i in range(num_nodes)
            for j in range(i+1, num_nodes)]
sim_flat.sort(key=lambda x: x[2], reverse=True)
similarity_edges = [[ids[i], ids[j]] for i, j, _ in sim_flat[:100]]

# 6. 把两类新边一次性写回 Mongo（只写一次即可）
temp_coll.update_many(
    {"session_tag": session_tag},
    {
        "$set": {
            "predicted_edges": predicted_edges,
            "similarity_edges": similarity_edges
        }
}
)
print("GNN link-prediction completed, predicted edges count:", len(predicted_edges))
