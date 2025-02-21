<template>
    <!-- 导航区 -->
    <div class="sidebar">
        <ul class="nav-list">
            <!-- 单独拎出“我的主页” -->
            <li class="nav-item" id="nav-logo" :class="{ active: currentRoute === '/home' }" @click="setActiveLink('/home')">
                <RouterLink to="/home">
                    <div class="icon">
                        <div class="image-box">
                            <img src="./goat.jpg" alt="My Home">
                        </div>
                    </div>
                    <div class="text">我的主页</div>
                </RouterLink>
            </li>

            <li
                v-for="item in navItems"
                :key="item.path"
                class="nav-item"
                :class="{ active: currentRoute === item.path }"
                @click="setActiveLink(item.path)"
            >
                <RouterLink :to="item.path">
                    <div class="icon">
                        <div v-if="item.image" class="image-box">
                            <img :src="item.image" alt="">
                        </div>
                        <i v-else :class="item.icon"></i>
                    </div>
                    <div class="text">{{ item.text }}</div>
                </RouterLink>
            </li>            
            <hr>
        
            <label class="theme-switch">
                <span class="sun">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="#ffd43b">
                            <circle r="5" cy="12" cx="12"></circle>
                            <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                        </g>
                    </svg>
                </span>

                <span class="moon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
                    </svg>
                </span>

                <input type="checkbox" class="theme-input" v-model="isDarkMode">
                <span class="slider"></span>
            </label>
        </ul>
    </div>

    <!-- 展示区 -->
    <div class="main-content">
        <RouterView></RouterView>
    </div>
</template>

<script lang="ts" setup name="App">
import { RouterView, RouterLink,useRoute } from 'vue-router';
import { ref, watch, onMounted } from 'vue';

// 定义当前路由路径
const route = useRoute();
const currentRoute = ref(route.path);

// 定义导航项数据
const navItems = [
    { path: '/', text: '回到首页', image: './白色校徽.png' },
    { path: '/bot_test', text: '创建新的聊天', icon: 'iconfont icon-cangku' },
    { path: '/History', text: '历史记录', icon: 'iconfont icon-zhuti_tiaosepan' },
    { path: '/About_ourselves', text: '关于我们', icon: 'iconfont icon-tupian' }
];

// 监听路由变化，更新当前激活的导航项
watch(() => route.path, (newPath) => {
    currentRoute.value = newPath;
});

// 点击导航项时设置当前激活的导航项
function setActiveLink(path: string) {
    currentRoute.value = path;
}

// 主题切换逻辑
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

// 初始化主题
onMounted(() => {
    if (isDarkMode.value) {
        document.body.classList.add('dark-theme');
    }
});
</script>

<style>
/* 侧边栏导航-白天模式 */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
}

.main-content { 
    height: 100vh;
    width: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding:20px;
    background-color: #e4e9f5;
}

#home {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font: 900 100px '';
    color: rgba(110, 90, 240, 0.3);
    background: #e4e9f5;
}

hr {
    border: 0;
    height: 2px;
    background: #a49ed6;
    margin: 30px 0;
    width: 275px;
}

.sidebar {
    padding: 0;
    position: fixed;
    width: 87px;
    height: 75%;
    background: #fff;
    z-index: 9999;
    transition: width 0.5s;
    padding-left: 10px;
    overflow: hidden;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    border-radius: 0 10px 10px 0;
}

.sidebar:hover {
    width: 300px;
}

.image-box {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    background-color: black;
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sidebar ul {
    left: 0;
    position: relative;
    height: 100%;
}

.nav-item {
    position: relative;
    padding: 10px;
}

.active {
    background: #e4e9f5;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
}

.active::before {
    content: "";
    position: absolute;
    top: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-bottom-right-radius: 25px;
    box-shadow: 5px 5px 0 5px #e4e9f5;
    background: transparent;
}

.active::after {
    content: "";
    position: absolute;
    bottom: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-top-right-radius: 25px;
    box-shadow: 5px -5px 0 5px #e4e9f5;
    background: transparent;
}

#nav-logo {
    margin: 40px 0 40px 0;
}

.nav-item a {
    position: relative;
    display: flex;
    white-space: nowrap;
}

.icon {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 60px;
    padding-left: 10px;
    height: 70px;
    color: rgb(110, 90, 240, 0.5);
}

.icon i {
    font-size: 30px;
    z-index: 999;
}

.text {
    position: relative;
    height: 70px;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #333;
    padding-left: 23px;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: 0.5s;
}

.nav-item:hover a .icon,
.nav-item:hover a .text {
    color: #ffa117;
}

.active a .icon::before {
    content: "";
    position: absolute;
    inset: 5px;
    width: 60px;
    background: #fff;
    border-radius: 50%;
    transition: 0.5s;
    border: 7px solid rgb(110, 90, 240);
    box-sizing: border-box;
}

/* 侧边栏导航-夜间模式 */
/* 黑暗模式下的 main-content 样式 */
.dark-theme .main-content {
    background-color: #222222; /* 暗色背景 */
    color: #ffffff; /* 文字颜色为白色 */
}

.dark-theme #home {
    background: #222222;
    color: #ffffff;
}

.dark-theme hr {
    background: #555555;
}

.dark-theme .sidebar {
    background: #181818;
}

.dark-theme .nav-item a .icon,
.dark-theme .nav-item a .text {
    color: #ffffff;
}

.dark-theme .active {
    background: #222222;
}

.dark-theme .active a .icon::before {
    border: 7px solid #ffffff;
}

.dark-theme .theme-switch .slider {
    background-color: #73C0FC;
}

.dark-theme .theme-switch .slider:before {
    background-color: #e8e8e8;
}

.dark-theme .theme-switch .moon svg {
    fill: #ffffff;
}

.dark-theme .active::before {
    box-shadow: 5px 5px 0 5px #222222;
}

.dark-theme .active::after {
    box-shadow: 5px -5px 0 5px #222222;
}

/* 切换按钮 */
.theme-switch {
    margin: 12px 0 0 105px;
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 64px;
    height: 34px;
}

.theme-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #73C0FC;
    transition: .4s;
    border-radius: 30px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 30px;
    width: 30px;
    border-radius: 20px;
    left: 2px;
    bottom: 2px;
    z-index: 2;
    background-color: #e8e8e8;
    transition: .4s;
}

.sun svg {
    position: absolute;
    top: 6px;
    left: 36px;
    z-index: 1;
    width: 24px;
    height: 24px;
}

.moon svg {
    fill: #73C0FC;
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 1;
    width: 24px;
    height: 24px;
}

.sun svg {
    animation: rotate 15s linear infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}

.moon svg {
    animation: tilt 5s linear infinite;
}

@keyframes tilt {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(-10deg);
    }

    75% {
        transform: rotate(10deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

.theme-input:checked+.slider {
    background-color: #183153;
}

.theme-input:focus+.slider {
    box-shadow: 0 0 1px #183153;
}

.theme-input:checked+.slider:before {
    transform: translateX(30px);
}
</style>