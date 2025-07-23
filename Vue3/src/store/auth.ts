import { defineStore } from 'pinia';
import request from '@/utils/request';
import { ref, computed, watch } from 'vue';

interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const showLoginModal = ref(false);
  const intendedRoute = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // 设置认证信息
  const setAuth = (userData: User, authToken: string) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    request.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    // 触发认证状态变化事件
    window.dispatchEvent(new CustomEvent('auth-status-changed', { 
      detail: { isAuthenticated: true, user: userData } 
    }));
  };

  // 清除认证信息
  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete request.defaults.headers.common['Authorization'];
    
    // 触发认证状态变化事件
    window.dispatchEvent(new CustomEvent('auth-status-changed', { 
      detail: { isAuthenticated: false } 
    }));
  };

  // 检查认证状态
  const checkAuth = async () => {
    if (!token.value) return false;
    
    try {
      const { data } = await request.get('/auth/me');
      user.value = data.user;
      return true;
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  // 登录
  const login = async (credentials: { email: string; password: string }) => {
    const { data } = await request.post('/auth/login', credentials);
    setAuth(data.user, data.token);
    
    // 登录成功后刷新页面或跳转到目标路由
    if (intendedRoute.value) {
      window.location.href = intendedRoute.value;
    } else {
      window.location.reload();
    }
    
    return data;
  };

  // 注册
  const register = async (userData: { email: string; password: string; username?: string }) => {
    const { data } = await request.post('/auth/register', userData);
    setAuth(data.user, data.token);
    
    // 注册成功后刷新页面
    window.location.reload();
    
    return data;
  };

  // 登出
  const logout = async () => {
    try {
      await request.post('/auth/logout');
    } finally {
      clearAuth();
      window.location.href = '/home';
    }
  };

  // 显示登录弹窗
  const showLogin = (route?: string) => {
    intendedRoute.value = route || null;
    showLoginModal.value = true;
  };

  // 隐藏登录弹窗
  const hideLogin = () => {
    showLoginModal.value = false;
    intendedRoute.value = null;
  };

  // 监听认证状态变化
  watch(isAuthenticated, (newValue) => {
    if (newValue) {
      // 认证成功，可以执行一些初始化操作
      console.log('用户已登录');
    } else {
      // 认证失败或登出
      console.log('用户未登录');
    }
  });

  // 初始化时检查认证状态
  checkAuth();

  return {
    user,
    token,
    isAuthenticated,
    showLoginModal,
    intendedRoute,
    login,
    register,
    logout,
    checkAuth,
    showLogin,
    hideLogin
  };
});
