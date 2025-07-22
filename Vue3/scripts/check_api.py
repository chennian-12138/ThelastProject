# import requests
# from urllib.parse import quote_plus

# kw = "mango detection"
# url = f"https://api.semanticscholar.org/graph/v1/paper/search"
# params = {
#     "query": kw,
#     "fields": "paperId,title,year,authors,references",
#     "limit": 50
# }
# resp = requests.get(url, params=params, timeout=10)
# print("HTTP 状态码:", resp.status_code)
# print("响应头:", resp.headers)
# print("原始 JSON:", resp.text[:500])

import requests, json
kw = "deep learning"
url = "https://api.semanticscholar.org/graph/v1/paper/search"
params = dict(query=kw, fields="paperId,title", limit=10)
resp = requests.get(url, params=params, timeout=10)
print("HTTP:", resp.status_code)
print("JSON:", json.dumps(resp.json(), ensure_ascii=False, indent=2)[:600])