<template>
  <div class="landing-container" :class="{ 'dark-theme': isDarkMode }">
    <!-- 背景动画 -->
    <div class="background-animation">
      <div class="particle" v-for="i in 50" :key="i"></div>
    </div>

    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-text">📚 文献助手</span>
        </div>
        <div class="nav-links">
          <a href="#about" class="nav-link">关于我们</a>
          <button @click="handleLoginClick" class="login-btn">登录/注册</button>
          <!-- 主题切换按钮 -->
          <label class="theme-switch">
            <span class="sun" v-if="!isDarkMode">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor">
                  <circle r="5" cy="12" cx="12"></circle>
                  <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                </g>
              </svg>
            </span>

            <span class="moon" v-if="isDarkMode">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <g fill="currentColor">
                  <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
                </g>
              </svg>
            </span>

            <input type="checkbox" class="theme-input" v-model="isDarkMode">
          </label>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">智能文献助手</span>
          <br>
          <span class="subtitle">让学术研究更高效</span>
        </h1>
        <p class="hero-description">
          基于大语言模型的智能文献检索与对话平台，<br>
          为您提供专业的学术研究和文献分析服务
        </p>
        <div class="hero-buttons">
          <button @click="handleStartClick" class="cta-primary">
            立即开始
            <span class="arrow">→</span>
          </button>
          <button @click="scrollToFeatures" class="cta-secondary">
            了解更多
          </button>
        </div>
      </div>

      <!-- 3D展示区域 -->
      <div class="hero-visual">
        <div class="floating-card">
          <div class="card-content">
            <div class="icon">📊</div>
            <h3>文献图谱</h3>
            <p>可视化研究脉络</p>
          </div>
        </div>
        <div class="floating-card card-2">
          <div class="card-content">
            <div class="icon">💬</div>
            <h3>AI对话</h3>
            <p>智能学术问答</p>
          </div>
        </div>
        <div class="floating-card card-3">
          <div class="card-content">
            <div class="icon">🔍</div>
            <h3>智能检索</h3>
            <p>精准文献匹配</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色功能区域 -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">📊</div>
            </div>
            <h3>文献图谱可视化</h3>
            <p>通过交互式图谱展示文献间的引用关系和研究脉络，帮助您快速理解领域发展</p>
            <ul>
              <li>动态关系网络</li>
              <li>研究热点识别</li>
              <li>作者合作分析</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">💬</div>
            </div>
            <h3>AI智能对话</h3>
            <p>集成DeepSeek大语言模型，提供专业的学术对话和问题解答服务</p>
            <ul>
              <li>专业学术问答</li>
              <li>文献内容解析</li>
              <li>研究建议生成</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">🔍</div>
            </div>
            <h3>智能语义检索</h3>
            <p>基于语义理解的文献检索，超越关键词匹配，提供更精准的搜索结果</p>
            <ul>
              <li>语义理解搜索</li>
              <li>相关文献推荐</li>
              <li>个性化结果</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-bg">📋</div>
            </div>
            <h3>个人研究空间</h3>
            <p>保存您的检索历史和对话记录，构建个人化的研究知识库</p>
            <ul>
              <li>历史记录管理</li>
              <li>收藏文献整理</li>
              <li>研究进度跟踪</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用流程 -->
    <section class="workflow">
      <div class="container">
        <h2 class="section-title">使用流程</h2>
        <div class="workflow-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>注册登录</h3>
              <p>创建您的个人账户，开启智能文献之旅</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>文献检索</h3>
              <p>使用智能检索功能查找相关学术文献</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>图谱分析</h3>
              <p>通过可视化图谱理解文献关系和研究趋势</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>AI对话</h3>
              <p>与AI助手对话，深入理解文献内容</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.visits }}</div>
            <div class="stat-label">浏览次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.users }}</div>
            <div class="stat-label">注册人数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.chats }}</div>
            <div class="stat-label">对话次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.searches }}</div>
            <div class="stat-label">文献搜索次数</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>文献助手</h3>
            <p>让学术研究更高效、更智能</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a href="#features">功能特色</a></li>
              <li><a href="#about">关于我们</a></li>
              <li><a href="#contact">联系我们</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>邮箱: 1990493833@qq.com</p>
            <p>电话: 13357710382</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 文献助手. 保留所有权利.</p>
        </div>
      </div>
    </footer>

    <!-- 登录弹窗 -->
    <LoginModal :show="showLoginModal" @close="showLoginModal = false" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoginModal from '@/components/LoginModal.vue';
import axios from 'axios';

const stats = ref({
  visits: 0,
  users: 0,
  chats: 0,
  searches: 0
});

const router = useRouter();
const showLoginModal = ref(false);

// 主题切换逻辑 - 复用App.vue的实现
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// 监听主题切换
watch(isDarkMode, (newVal) => {
    if (newVal) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
});

// 检查登录状态
const isLoggedIn = ref(false);

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

const handleStartClick = () => {
  checkLoginStatus();
  if (isLoggedIn.value) {
    router.push('/home');
  } else {
    showLoginModal.value = true;
  }
};

const handleLoginClick = () => {
  showLoginModal.value = true;
};

const handleLoginSuccess = () => {
  showLoginModal.value = false;
  router.push('/home');
};

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
};

const recordVisit = async () => {
  try {
    await axios.post('http://localhost:3000/api/visit');
  } catch (error) {
    console.error('记录访问失败:', error);
  }
};

// 获取统计数据
const fetchStats = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/stats');
    stats.value = {
      visits: data.visits || 0,
      users: data.users || 0,
      chats: data.chats || 0,
      searches: data.searches || 0
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

onMounted(() => {
  // 初始化主题
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme');
  }
  
  checkLoginStatus();
  recordVisit();
  fetchStats();
});

// 监听登录状态变化，自动跳转
watch(() => localStorage.getItem('token'), (newToken) => {
  if (newToken && router.currentRoute.value.path === '/') {
    router.push('/home')
  }
}, { immediate: true })
</script>

<style scoped>
/* 恢复最初的配色方案 */
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
}

/* 暗色主题 */
.dark-theme .landing-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* 背景动画 */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

.dark-theme .particle {
  background: rgba(255, 255, 255, 0.1);
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
}

.dark-theme .navbar {
  background: rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主题切换按钮 */
.theme-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.theme-switch:hover {
  background: rgba(255, 255, 255, 0.3);
}

.theme-switch svg {
  width: 20px;
  height: 20px;
}

.theme-input {
  display: none;
}

/* 英雄区域 */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.cta-primary,
.cta-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.cta-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 3D展示区域 */
.hero-visual {
  flex: 1;
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  width: 200px;
  text-align: center;
  animation: float-card 6s ease-in-out infinite;
}

.dark-theme .floating-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-2 {
  top: 50px;
  left: 150px;
  animation-delay: -2s;
}

.card-3 {
  top: 100px;
  left: 50px;
  animation-delay: -4s;
}

@keyframes float-card {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.card-content .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-content h3 {
  color: white;
  margin-bottom: 0.5rem;
}

.card-content p {
  color: rgba(255, 255, 255, 0.8);
}

/* 功能区域 */
.features {
  padding: 5rem 0;
  background: white;
}

.dark-theme .features {
  background: #1a1a2e;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 3rem;
}

.dark-theme .section-title {
  color: #667eea;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
  transition: transform 0.3s ease;
  border: 1px solid #e0e0e0;
}

.dark-theme .feature-card {
  background: #2a2a3e;
  border: 1px solid #3a3a4e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
}

.feature-icon {
  margin-bottom: 1.5rem;
}

.icon-bg {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.dark-theme .feature-card h3 {
  color: #667eea;
}

.feature-card p {
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.dark-theme .feature-card p {
  color: #ccc;
}

.feature-card ul {
  list-style: none;
  padding: 0;
}

.feature-card li {
  color: #666;
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;
}

.dark-theme .feature-card li {
  color: #aaa;
}

.feature-card li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #667eea;
}

/* 使用流程 */
.workflow {
  padding: 5rem 0;
  background: #f8f9fa;
}

.dark-theme .workflow {
  background: #16213e;
}

.workflow-steps {
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
  border: 1px solid #e0e0e0;
}

.dark-theme .step {
  background: #2a2a3e;
  border: 1px solid #3a3a4e;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 2rem;
}

.step-content h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.dark-theme .step-content h3 {
  color: #667eea;
}

.step-content p {
  color: #666;
}

.dark-theme .step-content p {
  color: #aaa;
}

/* 统计数据 */
.stats {
  padding: 5rem 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 页脚 */
.footer {
  background: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
}

.dark-theme .footer {
  background: #0f3460;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: #ecf0f1;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #34495e;
  color: #95a5a6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .hero-visual {
    margin-top: 2rem;
    height: 300px;
  }

  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-link {
    display: none;
  }

  .theme-switch {
    margin-left: auto;
  }
}
</style>
