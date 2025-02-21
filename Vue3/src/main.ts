import { createApp } from "vue";
// 引入createApp用于创建应用
import App from './App.vue'
// 引入App根组件
// 引入路由器
import router from "./router";

const app = createApp(App)
// 创建整个应用

app.use(router)
app.mount('#app')
// 创建路由环境，并挂载整个应用到app容器中