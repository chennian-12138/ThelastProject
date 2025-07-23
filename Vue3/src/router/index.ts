import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

import home            from '@/pages/home.vue';
import bot_test        from '@/pages/bot_test.vue';
import about_ourselves from '@/pages/about_ourselves.vue';
import history         from '@/pages/history.vue';
import Login           from '@/components/LoginForm.vue';
import Register        from '@/components/RegisterForm.vue';
import LiteratureGraph from '@/components/LiteratureGraph.vue';
import UserProfile     from '@/components/UserProfile.vue';

const routes = [
  { name: 'home',  path: '/home',            component: home },
  { name: 'bot',   path: '/bot',             component: bot_test },
  { name: 'about', path: '/about',           component: about_ourselves },
  { name: 'history', path: '/history',       component: history },
  { name: 'graph', path: '/graph',           component: LiteratureGraph },
  { name: 'profile', path: '/profile',       component: UserProfile },

  // 登录 / 注册（保留独立页面，但主要使用弹窗）
  { name: 'login',    path: '/login',    component: Login },
  { name: 'register', path: '/register', component: Register },

  // 默认重定向
  { path: '/', redirect: '/home' },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 检查认证状态
  await authStore.checkAuth();
  
  // 需要认证的路由
  const requiresAuth = ['/bot', '/history', '/graph', '/profile'].includes(to.path);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // 保存目标路由
    authStore.showLogin(to.path);
    next('/home');
  } else {
    next();
  }
});

export default router;
