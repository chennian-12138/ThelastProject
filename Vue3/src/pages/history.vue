<template>
  <div class="history-page">
    <div class="history-header">
      <h2>历史记录</h2>
    </div>

    <!-- 登录提示 -->
    <div v-if="!isAuthenticated" class="login-required">
      <p>请先登录以查看您的历史记录</p>
      <button @click="showLoginModal = true" class="login-btn">立即登录</button>
    </div>

    <!-- 历史记录内容 -->
    <div v-else>
      <!-- 统计信息 -->
      <div class="stats">
        <div class="stat-card">
          <h3>对话历史</h3>
          <span class="count">{{ historyStore.chatHistory.length }}</span>
        </div>
        <div class="stat-card">
          <h3>检索历史</h3>
          <span class="count">{{ historyStore.literatureQueries.length }}</span>
        </div>
      </div>

      <!-- 对话历史 -->
      <section class="history-section">
        <div class="section-header">
          <h3>对话历史</h3>
          <button @click="clearChatHistory" class="clear-btn" :disabled="historyStore.chatHistory.length === 0">
            清空对话
          </button>
        </div>
        
        <div v-if="historyStore.isLoading" class="loading">加载中...</div>
        
        <div v-else-if="historyStore.chatHistory.length === 0" class="empty">
          暂无对话记录
        </div>
        
        <ul v-else class="chat-list">
          <li v-for="(item, index) in historyStore.chatHistory" :key="index" class="chat-item">
            <div class="chat-content">
              <strong>{{ getChatRole(item) }}:</strong> {{ getChatText(item) }}
            </div>
            <div class="chat-time">
              {{ formatTime(getTimestamp(item)) }}
            </div>
          </li>
        </ul>
      </section>

      <!-- 文献检索历史 -->
      <section class="history-section">
        <div class="section-header">
          <h3>文献检索历史</h3>
          <button @click="clearLiteratureHistory" class="clear-btn" :disabled="historyStore.literatureQueries.length === 0">
            清空检索
          </button>
        </div>
        
        <div v-if="historyStore.isLoading" class="loading">加载中...</div>
        
        <div v-else-if="historyStore.literatureQueries.length === 0" class="empty">
          暂无检索记录
        </div>
        
        <ul v-else class="literature-list">
          <li v-for="(item, index) in historyStore.literatureQueries" :key="index" class="literature-item">
            <a href="#" @click.prevent="executeLiteratureSearch(getKeyword(item))" class="literature-link">
              <div class="literature-content">
                <strong>{{ getKeyword(item) }}</strong>
                <span class="metadata">
                  ({{ getNodesCount(item) }} 节点 / {{ getEdgesCount(item) }} 边)
                </span>
              </div>
              <div class="literature-time">
                {{ formatTime(getTimestamp(item)) }}
              </div>
            </a>
          </li>
        </ul>
      </section>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useHistoryStore } from '@/store/history';
import { useRouter } from 'vue-router';
import LoginModal from '@/components/LoginModal.vue';

const authStore = useAuthStore();
const historyStore = useHistoryStore();
const router = useRouter();
const showLoginModal = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userEmail = computed(() => authStore.user?.email || '');

// 安全获取数据的方法
const getChatRole = (item: any): string => {
  return item.data?.role || item.role || '用户';
};

const getChatText = (item: any): string => {
  return item.data?.text || item.text || '未知内容';
};

const getKeyword = (item: any): string => {
  return item.data?.keyword || item.keyword || '未知关键词';
};

const getNodesCount = (item: any): number => {
  return item.data?.nodesCount || item.nodesCount || 0;
};

const getEdgesCount = (item: any): number => {
  return item.data?.edgesCount || item.edgesCount || 0;
};

const getTimestamp = (item: any): string | number | Date => {
  return item.createdAt || item.timestamp || new Date();
};

// 格式化时间
const formatTime = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 执行文献检索
const executeLiteratureSearch = async (keyword: string) => {
  try {
    // 跳转到文献图谱页面并执行搜索
    router.push({
      path: '/graph',
      query: { q: keyword }
    });
  } catch (error) {
    console.error('执行文献检索失败:', error);
    alert('执行检索失败，请重试');
  }
};

// 清空对话历史
const clearChatHistory = async () => {
  if (confirm('确定要清空所有对话记录吗？')) {
    try {
      await historyStore.clear('chat');
    } catch (error) {
      alert('清空失败，请重试');
    }
  }
};

// 清空文献检索历史
const clearLiteratureHistory = async () => {
  if (confirm('确定要清空所有检索记录吗？')) {
    try {
      await historyStore.clear('literature');
    } catch (error) {
      alert('清空失败，请重试');
    }
  }
};

// 初始化加载
onMounted(async () => {
  await authStore.checkAuth();
  if (isAuthenticated.value) {
    await historyStore.init();
  }
});
</script>

<style scoped>
.history-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.login-required {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.login-btn {
  padding: 0.75rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  flex: 1;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.count {
  font-size: 2rem;
  font-weight: bold;
  color: #4f46e5;
}

.history-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.chat-list, .literature-list {
  list-style: none;
  padding: 0;
}

.chat-item, .literature-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.chat-item:last-child, .literature-item:last-child {
  border-bottom: none;
}

.chat-content, .literature-content {
  margin-bottom: 0.5rem;
}

.chat-time, .literature-time {
  font-size: 0.9rem;
  color: #666;
}

.literature-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.literature-link:hover {
  background: #f8f9fa;
}

.metadata {
  color: #666;
  font-size: 0.9rem;
}

/* 暗色主题支持 */
:global(.dark-theme) .history-page {
  background: #1a1a1a;
  color: #e5e5e5;
}

:global(.dark-theme) .stat-card,
:global(.dark-theme) .login-required {
  background: #2a2a2a;
}

:global(.dark-theme) .literature-link:hover {
  background: #2a2a2a;
}
</style>
