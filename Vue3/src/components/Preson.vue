<template>
    <div class="person">
    <h1>姓名:{{ name }}</h1>
    <h2>年龄:{{ age }}</h2>
    <h3>地址:{{ address }}</h3>
    <button @click = "showTel">查看联系方式</button>
    <button @click = "changeName">修改名字</button>
    <button @click= "changeAge">修改年龄</button>
    </div>
    <!-- 这里是模版的写法，也就是我的前端页面当中要给出那些东西 -->
</template>

<!-- 可以通过这个方式直接写语句，不需要在用其他的函数包裹 -->
<script setup lang = 'ts'>

    import {ref} from 'vue'
    // 响应式设计，凡事需要做到响应式的，都需要用vue包裹一下

    //数据  
    let name = ref("张三")
    let age = ref(18)
    let tel = '13912215493'
    let address = "中国药科大学教务处"
    // 操作ref包裹的东西，需要加.value

    // 方法
    function changeName(){
        name.value = "李四"
    }
    function changeAge(){
        age.value += 1
    }
    function showTel(){
        alert(tel)
    }
    // return{name:name,age:age,changeName,changeAge,showTel}
// 脚本当中存着相应的数据，这种写法就是组合式写法，需要通过对象来进行调用
// setup里面没有this，所以最好使用箭头函数表达式，可直接指定渲染的内容

</script>

<style scoped>
    .person{
        background-color: yellow;
        box-shadow: 0 0 10px;
        border-radius:10px;
        padding: 20px;
    }
</style>