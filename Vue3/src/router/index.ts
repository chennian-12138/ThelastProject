// 创建一个路由器，并暴露出去

// 第一步：引入createrRouter
import { createRouter,createWebHistory } from 'vue-router';
// import { routes } from "vue-router/auto-routes";
// 引入可能要使用的组件
import home from '@/components/home.vue';
import bot_test from "@/components/bot_test.vue";
import about_ourselves from "@/components/about_ourselves.vue";
import history from "@/components/history.vue";


// 第二步：创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/home',component:home,},
        {path:'/Bot_test',component:bot_test},
        {path:'/About_ourselves',component:about_ourselves},
        {path:'/History',component:history}
    ]
})

export default router