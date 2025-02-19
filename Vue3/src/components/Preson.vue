<template>
    <div class="car">
        <h2>一辆{{ car.brand }}的车，价值{{ car.price }}万</h2>
        <button @click="changePrice">修改价格</button>
        <button @click="changeFirstGame">修改游戏</button>
        <ul>
            <li v-for = "item in games" :key = "item.id">{{ item.name }}</li>
            <!-- 通过这个方式来枚举出列表 -->
        </ul>
    </div>
</template>

<script setup lang = 'ts'>
    import {ref} from 'vue'
    let car = ref({brand:'奔驰',price:100})
    // 对对象进行响应式操作，需要使用reactive
    let games = ref([
        {id:'game01',name:'原神'},
        {id:'game02',name:'三国志'},
        {id:'game03',name:'王者荣耀'},
    ])

    function changePrice(){
        car.value.price += 10 
    }
    function changeFirstGame(){
        games.value[0].name = "我不知道"
    }
</script>

<style scoped>
li{font-size: 20px;}
</style>