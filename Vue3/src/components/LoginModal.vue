<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isLogin ? '登录' : '注册' }}</h2>
          <button class="close-btn" @click="close">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>邮箱</label>
              <input 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="请输入邮箱"
              />
            </div>
            
            <div class="form-group">
              <label>密码</label>
              <input 
                v-model="form.password" 
                type="password" 
                required 
                placeholder="请输入密码"
                minlength="6"
              />
            </div>
            
            <div v-if="!isLogin" class="form-group">
              <label>用户名（可选）</label>
              <input 
                v-model="form.username" 
                type="text" 
                placeholder="请输入用户名"
              />
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
              </button>
            </div>
          </form>
          
          <div class="switch-mode">
            <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
            <button type="button" class="switch-btn" @click="toggleMode">
              {{ isLogin ? '立即注册' : '去登录' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isLogin = ref(true);
const loading = ref(false);
const form = reactive({
  email: '',
  password: '',
  username: ''
});

const close = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  form.email = '';
  form.password = '';
  form.username = '';
  loading.value = false;
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  resetForm();
};

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    if (isLogin.value) {
      await authStore.login({
        email: form.email,
        password: form.password
      });
    } else {
      await authStore.register({
        email: form.email,
        password: form.password,
        username: form.username || undefined
      });
    }
    
    // 登录成功后处理
    if (authStore.intendedRoute) {
      router.push(authStore.intendedRoute);
      authStore.hideLogin();
    }
    
    close();
  } catch (error: any) {
    alert(error.response?.data?.message || '操作失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 监听show变化，重置表单
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm();
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #3730a3;
}

.submit-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.switch-btn {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.switch-btn:hover {
  color: #3730a3;
}

/* 暗色主题支持 */
:global(.dark-theme) .modal-container {
  background: #1a1a1a;
  color: #e5e5e5;
}

:global(.dark-theme) .modal-header {
  border-bottom-color: #333;
}

:global(.dark-theme) .form-group input {
  background: #2a2a2a;
  border-color: #444;
  color: #e5e5e5;
}

:global(.dark-theme) .close-btn {
  color: #aaa;
}

:global(.dark-theme) .close-btn:hover {
  color: #fff;
}
</style>
