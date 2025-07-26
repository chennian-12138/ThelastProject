<template>
  <div class="user-home-container">
    <!-- 顶部用户信息区域 -->
    <header class="user-header">
      <div class="header-content">
        <div class="user-profile">
          <img :src="userAvatar" alt="用户头像" class="user-avatar-large">
          <div class="user-details">
            <h1 class="user-name">{{ userName }}</h1>
            <p class="user-email">{{ userInfo.email }}</p>
            <div class="user-meta">
              <span>注册于 {{ formatDate(userInfo.createdAt) }}</span>
              <span>最近登录 {{ formatDate(userInfo.lastLogin) }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button @click="logout" class="logout-btn">
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 - 单页面布局 -->
    <main class="main-content">
      <!-- 左侧：使用统计和最近活动 -->
      <aside class="left-panel">
        <!-- 使用统计 -->
        <section class="stats-section">
          <h2 class="section-title">使用统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🔍</div>
              <div class="stat-number">{{ stats.totalSearches || 0 }}</div>
              <div class="stat-label">搜索次数</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💬</div>
              <div class="stat-number">{{ stats.totalChats || 0 }}</div>
              <div class="stat-label">对话次数</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-number">{{ stats.savedPapers || 0 }}</div>
              <div class="stat-label">收藏文献</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-number">{{ stats.graphViews || 0 }}</div>
              <div class="stat-label">图谱查看</div>
            </div>
          </div>
        </section>

        <!-- 个人信息编辑 -->
        <section class="profile-section">
          <h2 class="section-title">个人信息</h2>
          <div class="profile-info">
            <div class="info-row">
              <label>用户名</label>
              <div class="info-value">
                <span>{{ userInfo.username || '未设置' }}</span>
                <button @click="editField('username')" class="edit-btn">✏️</button>
              </div>
            </div>
            <div class="info-row">
              <label>邮箱</label>
              <div class="info-value">
                <span>{{ userInfo.email }}</span>
                <button @click="editField('email')" class="edit-btn">✏️</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 最近活动 -->
        <section class="activity-section">
          <h2 class="section-title">最近活动</h2>
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ formatDateTime(activity.time) }}</div>
              </div>
            </div>
          </div>
        </section>
      </aside>

      <!-- 右侧：快捷操作 -->
      <section class="right-panel">
        <h2 class="section-title">快捷操作</h2>
        <div class="quick-actions-grid">
          <button @click="goToPage('/bot')" class="action-card primary">
            <div class="action-icon-large">💬</div>
            <h3>开始对话</h3>
            <p>与AI助手进行学术对话</p>
          </button>
          
          <button @click="goToPage('/graph')" class="action-card secondary">
            <div class="action-icon-large">📊</div>
            <h3>查看图谱</h3>
            <p>探索文献关系网络</p>
          </button>
          
          <button @click="goToPage('/history')" class="action-card tertiary">
            <div class="action-icon-large">📋</div>
            <h3>历史记录</h3>
            <p>查看您的搜索和对话历史</p>
          </button>
          
          <button @click="goToPage('/search')" class="action-card quaternary">
            <div class="action-icon-large">🔍</div>
            <h3>文献搜索</h3>
            <p>开始新的文献检索</p>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const userName = ref('用户');
const userAvatar = ref('/头像.png');
const userInfo = ref({
  username: '',
  email: '',
  createdAt: '',
  lastLogin: ''
});

const stats = ref({
  totalSearches: 0,
  totalChats: 0,
  savedPapers: 0,
  graphViews: 0
});

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  time: Date;
}

const recentActivities = ref<ActivityItem[]>([]);

const loadUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const userResponse = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data.user;
      
      userInfo.value = {
        username: user.username || user.email.split('@')[0],
        email: user.email,
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString()
      };
      userName.value = user.username || user.email.split('@')[0];
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      userInfo.value = {
        username: user.username || user.email.split('@')[0],
        email: user.email,
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString()
      };
      userName.value = user.username || user.email.split('@')[0];
    }
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/user/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    stats.value = response.data;
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const formatDateTime = (date: Date) => {
  return date.toLocaleString('zh-CN');
};

const editField = async (field: string) => {
  const newValue = prompt(`请输入新的${field === 'username' ? '用户名' : '邮箱'}:`);
  if (!newValue) return;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.put('http://localhost:3000/api/user/update', 
      { [field]: newValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      userInfo.value[field as keyof typeof userInfo.value] = newValue;
      if (field === 'username') {
        userName.value = newValue;
      }
    }
  } catch (error: any) {
    alert('更新失败: ' + (error.response?.data?.error || error.message));
  }
};

const goToPage = (path: string) => {
  router.push(path);
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/');
};

onMounted(async () => {
  await loadUserData();
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/user/activities', {
      headers: { Authorization: `Bearer ${token}` }
    });
    recentActivities.value = response.data.slice(0, 5); // 限制显示5条
  } catch (error) {
    console.error('获取活动失败:', error);
  }
});
</script>

<style scoped>
/* 使用CSS变量定义主题颜色 - 复用全局主题 */
.user-home-container {
  min-height: 100vh;
  background-color: var(--bg-color, #fafff9);
  color: var(--text-color, #272a27);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 顶部用户信息区域 */
.user-header {
  background-color: var(--surface-color, #ffffff);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1.5rem;
}

.user-profile {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
}

.user-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--primary-color, #4f6f57);
}

.user-details h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  color: var(--primary-color, #4f6f57);
}

.user-email {
  margin: 0 0 0.25rem 0;
  color: var(--text-color, #272a27);
  font-size: 0.9rem;
}

.user-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-color, #272a27);
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.logout-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: var(--primary-color, #4f6f57);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 主要内容区域 - 紧凑布局 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.left-panel,
.right-panel {
  display: grid;
  gap: 1rem;
  align-content: start;
  overflow-y: auto;
  padding: 0.5rem 0;
}

/* 各个区块样式 - 紧凑设计 */
.stats-section,
.activity-section,
.profile-section {
  background-color: var(--surface-color, #ffffff);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, #e0e0e0);
}

.section-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  color: var(--primary-color, #4f6f57);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  padding-bottom: 0.5rem;
}

/* 统计卡片网格 - 紧凑布局 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.stat-card {
  background-color: var(--bg-color, #fafff9);
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  border: 1px solid var(--border-color, #e0e0e0);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color, #4f6f57);
  margin-bottom: 0.125rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-color, #272a27);
  opacity: 0.8;
}

/* 活动列表 - 紧凑布局 */
.activity-list {
  display: grid;
  gap: 0.5rem;
}

.activity-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: var(--bg-color, #fafff9);
  border-radius: 6px;
  border: 1px solid var(--border-color, #e0e0e0);
}

.activity-icon {
  font-size: 1.2rem;
}

.activity-title {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.125rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-color, #272a27);
  opacity: 0.7;
}

/* 个人信息 - 紧凑布局 */
.profile-info {
  display: grid;
  gap: 0.75rem;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.5rem;
}

.info-row label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-color, #272a27);
  opacity: 0.8;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.edit-btn:hover {
  opacity: 1;
}

/* 快捷操作区域 - 紧凑布局 */
.right-panel {
  background-color: var(--surface-color, #ffffff);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, #e0e0e0);
}

.quick-actions-grid {
  display: grid;
  gap: 0.75rem;
}

.action-card {
  background-color: var(--bg-color, #fafff9);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, #e0e0e0);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid;
}

.action-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-card.primary {
  border-left-color: var(--primary-color, #4f6f57);
}

.action-card.secondary {
  border-left-color: #4f6f57;
}

.action-card.tertiary {
  border-left-color: #9db39a;
}

.action-card.quaternary {
  border-left-color: #c0dabd;
}

.action-icon-large {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.action-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--primary-color, #4f6f57);
}

.action-card p {
  margin: 0;
  color: var(--text-color, #272a27);
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 响应式设计 - 更紧凑 */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    height: auto;
    padding: 1rem;
  }

  .user-header {
    padding: 1rem;
  }

  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }

  .user-profile {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .user-avatar-large {
    width: 50px;
    height: 50px;
  }

  .user-details h1 {
    font-size: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-section,
  .activity-section,
  .profile-section,
  .right-panel {
    padding: 0.75rem;
  }
}
</style>
