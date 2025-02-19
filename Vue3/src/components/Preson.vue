<template>
    <div class="person">
    <h1>姓名:{{ name }}</h1>
    <h2>年龄:{{ age }}</h2>
    <button @click = "showTel">查看联系方式</button>
    <button @click = "changeName">修改名字</button>
    <button @click= "changeAge">修改年龄</button>
    </div>
    <!-- 这里是模版的写法，也就是我的前端页面当中要给出那些东西 -->
</template>

<script lang="ts">
    export default{
        name:'Person',
        setup(){
            // 数据
            let name = "张三"
            let age = 18
            let tel = '13912215493'
            // 这种写法不是响应式的，在后期进行更新的时候不会进行更新

            // 方法
            function changeName(){
                name = "李四"
            }
            function changeAge(){
                name += 1
            }
            function showTel(){
                alert("tel")
            }
            return{name:name,age:age,changeName,changeAge,showTel}

        }
        // 脚本当中存着相应的数据，这种写法就是组合式写法，需要通过对象来进行调用
    }
</script>

<style scoped>
    .person{
        background-color: yellow;
        box-shadow: 0 0 10px;
        border-radius:10px;
        padding: 20px;
    }
</style>