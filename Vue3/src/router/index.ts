import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { name: 'landing', path: '/', component: () => import('@/pages/LandingPage.vue') },
  { name: 'home', path: '/home', component: () => import('@/pages/UserHome.vue') },
  { name: 'bot', path: '/bot', component: () => import('@/pages/bot_test.vue') },
  { name: 'about', path: '/about', component: () => import('@/pages/about_ourselves.vue') },
  { name: 'history', path: '/history', component: () => import('@/pages/history.vue') },
  { name: 'graph', path: '/graph', component: () => import('@/components/LiteratureGraph.vue') },
  { name: 'profile', path: '/profile', component: () => import('@/components/UserProfile.vue') },
  { name: 'login', path: '/login', component: () => import('@/components/LoginForm.vue') },
  { name: 'register', path: '/register', component: () => import('@/components/RegisterForm.vue') }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 简化的路由守卫
router.beforeEach(async (to, from, next) => {
  const requiresAuth = ['/home', '/bot', '/history', '/graph', '/profile'].includes(to.path);
  const token = localStorage.getItem('token');
  
  if (requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;
