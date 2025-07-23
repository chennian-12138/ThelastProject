<template>
  <div class="home-container">
    <header class="home-header">
      <h1>文献检索与对话系统</h1>
      <p class="subtitle">基于大语言模型的智能文献检索与对话平台</p>
      
      <!-- 用户状态显示 -->
      <div class="user-status" v-if="isAuthenticated">
        <span class="welcome-text">欢迎，{{ userEmail }}</span>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
      <div class="user-status" v-else>
        <button @click="showLoginModal = true" class="login-btn">登录/注册</button>
      </div>
    </header>

    <!-- 功能导航 -->
    <nav class="feature-nav">
      <RouterLink to="/graph" class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>文献图谱</h3>
        <p>可视化文献关系网络，发现研究热点</p>
      </RouterLink>
      
      <RouterLink to="/bot" class="feature-card">
        <div class="feature-icon">💬</div>
        <h3>智能对话</h3>
        <p>与大语言模型对话，获取专业解答</p>
      </RouterLink>
      
      <RouterLink to="/history" class="feature-card">
        <div class="feature-icon">📋</div>
        <h3>历史记录</h3>
        <p>查看您的检索和对话历史</p>
      </RouterLink>
      
      <RouterLink to="/about" class="feature-card">
        <div class="feature-icon">ℹ️</div>
        <h3>关于我们</h3>
        <p>了解系统功能和使用方法</p>
      </RouterLink>
    </nav>

    <!-- 特色功能 -->
    <section class="features">
      <h2>系统特色</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <h3>🔍 智能检索</h3>
          <p>基于语义理解的文献检索，精准匹配您的需求</p>
        </div>
        <div class="feature-item">
          <h3>🧠 AI对话</h3>
          <p>集成DeepSeek大模型，提供专业学术对话</p>
        </div>
        <div class="feature-item">
          <h3>📈 可视化分析</h3>
          <p>文献关系图谱，直观展示研究脉络</p>
        </div>
        <div class="feature-item">
          <h3>🔐 个人中心</h3>
          <p>登录后保存您的检索和对话历史</p>
        </div>
      </div>
    </section>

    <!-- 登录弹窗 -->
    <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import LoginModal from '@/components/LoginModal.vue';

const authStore = useAuthStore();
const router = useRouter();
const showLoginModal = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userEmail = computed(() => authStore.user?.email || '');

// 登出
const logout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout();
    router.push('/home');
  }
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
}

.home-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.user-status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #34495e;
  font-weight: 500;
}

.login-btn, .logout-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-btn {
  background: #3498db;
  color: white;
}

.login-btn:hover {
  background: #2980b9;
}

.logout-btn {
  background: #e74c3c;
  color: white;
}

.logout-btn:hover {
  background: #c0392b;
}

.feature-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  display: block;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

.features {
  text-align: center;
}

.features h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.feature-item h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: #7f8c8d;
  line-height: 1.6;
}

/* 暗色主题支持 */
:global(.dark-theme) .home-container {
  background: #1a1a1a;
  color: #e5e5e5;
}

:global(.dark-theme) .feature-card {
  background: #2a2a2a;
  color: #e5e5e5;
}

:global(.dark-theme) .feature-item {
  background: #2a2a2a;
  border-left-color: #3498db;
}
</style>
