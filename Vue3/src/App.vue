<template>
    <!-- 这里写html内容 -->
        <person></person>
</template>

<script>
// 这里写JS或者TS代码,Vue推荐使用Ts书写
    import Person from './components/Preson.vue' 
    export default{
        name:"App",  // 这里是组件名
        components:{Person}// 注册组件
    }
</script>

<style>
    /* 这里写样式 */
    .app{
        background-color: blue;
        box-shadow: 0 0 10px;
        border-radius: 10px;
        padding: 20px;
    }
    .button{
        margin: 0 5px;
    }
</style>