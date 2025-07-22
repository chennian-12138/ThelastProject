import { createRouter, createWebHashHistory } from 'vue-router';

import home            from '@/pages/home.vue';
import bot_test        from '@/pages/bot_test.vue';
import about_ourselves from '@/pages/about_ourselves.vue';
import history         from '@/pages/history.vue';
import Login           from '@/components/LoginForm.vue';
import Register        from '@/components/RegisterForm.vue';
import LiteratureGraph from '@/components/LiteratureGraph.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: 'firstPage',  path: '/home',            component: home },
    { name: 'secondPage', path: '/Bot_test',        component: bot_test },
    { name: 'thirdPage',  path: '/About_ourselves', component: about_ourselves },
    { name: 'forthPage',  path: '/History',         component: history },
    { name: 'literatureGraph', path: '/graph', component: LiteratureGraph },

    // 登录 / 注册
    { name: 'login',    path: '/login',    component: Login },
    { name: 'register', path: '/register', component: Register },

    // 默认重定向
    { path: '/', redirect: '/home' },
  ],
});

export default router;