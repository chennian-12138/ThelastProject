<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar">
          {{ userInitial }}
        </div>
        <div class="user-info">
          <h3>{{ user?.email }}</h3>
          <p v-if="user?.username">@{{ user.username }}</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        退出登录
      </button>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <span class="stat-number">{{ historyCount }}</span>
        <span class="stat-label">历史记录</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ chatCount }}</span>
        <span class="stat-label">对话次数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ searchCount }}</span>
        <span class="stat-label">检索次数</span>
      </div>
    </div>

    <div class="profile-actions">
      <button class="action-btn">
        账户设置
      </button>
      <button class="action-btn secondary" @click="clearAllHistory">
        清空历史
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useHistoryStore } from '@/store/history';

const authStore = useAuthStore();
const historyStore = useHistoryStore();

const user = computed(() => authStore.user);
const userInitial = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || 'U';
});

const historyCount = computed(() => {
  return historyStore.chatHistory.length + historyStore.literatureQueries.length;
});

const chatCount = computed(() => historyStore.chatHistory.length);
const searchCount = computed(() => historyStore.literatureQueries.length);

const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout();
  }
};

const clearAllHistory = async () => {
  if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
    await historyStore.clear('chat');
    await historyStore.clear('literature');
  }
};
</script>

<style scoped>
.user-profile {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.user-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.user-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #c82333;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4f46e5;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.action-btn.secondary {
  background: #6c757d;
}

.action-btn:hover {
  opacity: 0.9;
}

/* 暗色主题支持 */
:global(.dark-theme) .profile-header,
:global(.dark-theme) .profile-stats {
  background: #2a2a2a;
}

:global(.dark-theme) .user-info h3 {
  color: #e5e5e5;
}
</style>
