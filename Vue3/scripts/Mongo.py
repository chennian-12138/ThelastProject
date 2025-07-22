from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))

# 先不筛选，直接拿一篇
doc = client.get_default_database().papers.find_one()
if doc:
    print("字段列表：", list(doc.keys()))
else:
    print("⚠️ 集合里没有文档，请检查数据库/集合名或数据是否导入成功。")