<script setup lang="ts">
import { ref } from 'vue';
import request from '../utils/request';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  try {
    await request.post('/auth/register', { email: email.value, password: password.value });
    alert('注册成功！请登录');
    router.replace('/login');
  } catch (e: any) {
    alert(e.response?.data?.message || '注册失败');
  }
};
</script>

<template>
  <form class="form" @submit.prevent="register">
    <p class="form-title">注册</p>

    <div class="input-container">
      <input v-model="email" type="email" placeholder="邮箱" required />
    </div>

    <div class="input-container">
      <input v-model="password" type="password" placeholder="密码（≥6 位）" minlength="6" required />
    </div>

    <button type="submit" class="submit">注册</button>

    <p class="signup-link">
      已有账号？
      <RouterLink to="/login">去登录</RouterLink>
    </p>
  </form>
</template>

<style scoped>
/* 同上，样式复用 */
 .form {
    background-color: #fff;
    display: block;
    padding: 1rem;
    max-width: 350px;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .form-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }

  .input-container {
    position: relative;
  }

  .input-container input, .form button {
    outline: none;
    border: 1px solid #e5e7eb;
    margin: 8px 0;
  }

  .input-container input {
    background-color: #fff;
    padding: 1rem;
    padding-right: 3rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    width: 300px;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .input-container span {
    display: grid;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    place-content: center;
  }

  .input-container span svg {
    color: #9CA3AF;
    width: 1rem;
    height: 1rem;
  }

  .submit {
    display: block;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    background-color: #4F46E5;
    color: #ffffff;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    width: 100%;
    border-radius: 0.5rem;
    text-transform: uppercase;
  }

  .signup-link {
    color: #6B7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
  }

  .signup-link a {
    text-decoration: underline;
  }
</style>
