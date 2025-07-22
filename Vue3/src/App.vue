<template>
    <!-- 导航区 -->

    <div class="forRobort">

    <nav class="sidebar">
        <ul class="nav-list">
            <!-- 单独拎出“我的主页” -->
            <li class="nav-item" id="nav-logo" :class="{ active: currentRoute === '/home' }" @click="setActiveLink('/home')">
                <RouterLink  replace :to="{path:'/home'}">
                    <div class="icon">
                        <div class="image-box">
                            <img src="../public/头像.png" alt="My Home">
                        </div>
                    </div>
                </RouterLink>
            </li>

            <li
                v-for="item in navItems"
                :key="item.path"
                class="nav-item"
                :class="{ active: currentRoute === item.path }"
                @click="setActiveLink(item.path)"
            >
                <RouterLink replace :to="{path:item.path}">
                    <div class="icon">
                        <div v-if="item.image" class="image-box">
                            <img :src="item.image" alt="">
                        </div>
                    </div>
                </RouterLink>
            </li>            
            <hr>
        
            <label class="theme-switch">
                <span class="sun" v-if="!isDarkMode">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="#4f6f57">
                            <circle r="5" cy="12" cx="12"></circle>
                            <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                        </g>
                    </svg>
                </span>

                <span class="moon" v-if="isDarkMode">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <g fill="#fafff9">
                        <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
                        </g>
                    </svg>
                </span>

                <input type="checkbox" class="theme-input" v-model="isDarkMode">
            </label>
        </ul>
    </nav>

    <!-- 右侧绿色边栏 -->

    <!-- 展示区 -->
    <div class="main-content">
        <RouterView></RouterView>
    </div>

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
    { path: '/', text: '回到首页', image: '/DeepSeek-r1.jpg' },
    { path: '/bot_test', text: '创建新的聊天', icon: 'iconfont icon-cangku' },
    { path: '/History', text: '历史记录', icon: 'iconfont icon-zhuti_tiaosepan' },
    { path: '/About_ourselves', text: '关于我们', icon: 'iconfont icon-tupian' },
    { path: '/graph', text: '文献图谱', icon: 'iconfont icon-tuoputu' }
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
    @import url("../src/assets/styles/App.css");
</style>