<template>
  <div class="user-home-container">
    <!-- 顶部导航栏 -->
    <nav class="home-navbar">
      <div class="nav-content">
        <h1>我的主页</h1>
        <div class="user-info">
          <span>{{ userName }}</span>
          <img :src="userAvatar" alt="用户头像" class="user-avatar">
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="home-content">
      <!-- 用户信息卡片 -->
      <div class="info-card">
        <h2>个人信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>用户名</label>
            <span>{{ userInfo.username || '未设置' }}</span>
            <button @click="editField('username')">修改</button>
          </div>
          <div class="info-item">
            <label>邮箱</label>
            <span>{{ userInfo.email || '未设置' }}</span>
            <button @click="editField('email')">修改</button>
          </div>
          <div class="info-item">
            <label>注册时间</label>
            <span>{{ formatDate(userInfo.createdAt || new Date().toISOString()) }}</span>
          </div>
          <div class="info-item">
            <label>最近登录</label>
            <span>{{ formatDate(userInfo.lastLogin || new Date().toISOString()) }}</span>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-card">
        <h2>使用统计</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalSearches || 0 }}</div>
            <div class="stat-label">总搜索次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalChats || 0 }}</div>
            <div class="stat-label">对话次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.savedPapers || 0 }}</div>
            <div class="stat-label">收藏文献</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.graphViews || 0 }}</div>
            <div class="stat-label">图谱查看</div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="activity-card">
        <h2>最近活动</h2>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ formatDateTime(activity.time) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <h2>快捷操作</h2>
        <div class="actions-grid">
          <button @click="goToPage('/bot')" class="action-btn">
            <span class="action-icon">💬</span>
            <span>开始对话</span>
          </button>
          <button @click="goToPage('/graph')" class="action-btn">
            <span class="action-icon">📊</span>
            <span>查看图谱</span>
          </button>
          <button @click="goToPage('/history')" class="action-btn">
            <span class="action-icon">📋</span>
            <span>历史记录</span>
          </button>
          <button @click="logout" class="action-btn logout">
            <span class="action-icon">🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
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
  // 从后端获取最新的用户信息，而不是依赖 localStorage
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // 获取用户信息
      const userResponse = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data.user;
      
      userInfo.value = {
        username: user.username || user.email.split('@')[0], // 使用邮箱前缀作为默认用户名
        email: user.email,
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString()
      };
      userName.value = user.username || user.email.split('@')[0];
      
      // 更新 localStorage
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 回退到 localStorage
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
  // 获取用户统计数据
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
      localStorage.setItem('user', JSON.stringify(userInfo.value));
    }
  } catch (error: any) {
    alert('更新失败: ' + (error.response?.data?.error || error.message));
  }
};
// 在模板中添加文件输入
const handleAvatarUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/api/user/avatar', 
      formData,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      }
    );

    if (response.data.success) {
      userAvatar.value = response.data.avatar;
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.avatar = response.data.avatar;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  } catch (error: any) {
    alert('上传失败: ' + (error.response?.data?.error || error.message));
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
  
  // 获取最近活动
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/user/activities', {
      headers: { Authorization: `Bearer ${token}` }
    });
    recentActivities.value = response.data;
  } catch (error) {
    console.error('获取活动失败:', error);
  }
});


</script>

<!-- 其余样式保持不变... -->

<style scoped>
.user-home-container {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.home-navbar {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.nav-content {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
}

.user-info {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.home-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card, .stats-card, .activity-card, .quick-actions {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-grid, .stats-grid, .actions-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  align-items: center;
  gap: 10px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 2em;
  font-weight: bold;
  color: #667eea;
}

.activity-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.action-btn {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.logout {
  background: #dc3545;
}

@media (max-width: 768px) {
  .home-content {
    grid-template-columns: 1fr;
  }
}
</style>
