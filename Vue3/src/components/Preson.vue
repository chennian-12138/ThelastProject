<template>
    <div class="person">
        <h2>当前求和为:{{ sum }}</h2>
        <button @click="add">点我sum+1</button>
    <hr>
    <img v-for = '(dog,index) in doglist' :src="dog" :key="index">
    <button @click = "addDog">再来一只小狗</button>
    </div>
</template>

<script setup lang = 'ts'>
    import useDog from '@/hooks/useDog';
    import useSum from '@/hooks/useSum';

    const {sum,add} = useSum()
    const {doglist,addDog} = useDog()

    // 可以集中管理数据与方法
</script>

<style scoped>
</style>