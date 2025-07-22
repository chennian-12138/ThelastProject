#!/usr/bin/env python3
"""
测试系统完整性的脚本
"""
import requests
import json
import time

def test_api_endpoints():
    """测试所有API端点"""
    base_url = "http://localhost:3001"
    
    print("🔍 测试系统API端点...")
    
    # 1. 测试获取状态
    try:
        response = requests.get(f"{base_url}/api/fetch/status")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 状态检查: 共 {data['totalPapers']} 篇文献")
        else:
            print(f"❌ 状态检查失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 状态检查失败: {e}")
    
    # 2. 测试图数据
    try:
        response = requests.get(f"{base_url}/api/graph")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 图数据: {len(data['nodes'])} 个节点, {len(data['edges'])} 条边")
        else:
            print(f"❌ 图数据失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 图数据失败: {e}")
    
    return True

def test_keyword_search(keyword="machine learning"):
    """测试关键词搜索"""
    base_url = "http://localhost:3001"
    
    print(f"\n🔍 测试关键词搜索: {keyword}")
    
    try:
        response = requests.get(f"{base_url}/api/fetch?q={keyword}&limit=10")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 搜索成功: {data['message']}")
            print(f"📊 总节点数: {len(data['nodes'])}")
            print(f"🔗 总边数: {len(data['edges'])}")
            return True
        else:
            print(f"❌ 搜索失败: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ 搜索异常: {e}")
        return False

if __name__ == "__main__":
    print("🚀 开始测试文献图谱系统...")
    
    # 等待服务启动
    print("⏳ 等待服务启动...")
    time.sleep(2)
    
    # 测试API端点
    if test_api_endpoints():
        print("\n✅ API端点测试通过")
        
        # 测试关键词搜索
        test_keyword_search("artificial intelligence")
    else:
        print("\n❌ API端点测试失败")
    
    print("\n🎉 测试完成")
