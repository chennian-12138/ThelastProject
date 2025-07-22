<template>
<div class="home-wrapper">
    <!-- 顶部欢迎区 + 登录/注册按钮 -->
    <header class="hero">
      <h1>欢迎来到 Vue3 + MongoDB Demo</h1>
      <p>请先登录或注册，体验完整功能</p>

      <div class="btn-group">
        <RouterLink to="/login" class="btn primary">登录</RouterLink>
        <RouterLink to="/register" class="btn secondary">注册</RouterLink>
      </div>
    </header>
  </div>
</template>


<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
}
.home-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
.hero h1 { margin-bottom: 0.5rem; }
.btn {
  margin: 0 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}
.primary  { background: #4f46e5; color: #fff; }
.secondary{ background: #e5e7eb; color: #111; }
</style>