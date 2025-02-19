<template>
    <div class="person">
        姓:<input type = "text" v-model="firstName"><br>
        名:<input type = "text" v-model="lastName"><br>
        全名:<span>{{ fullName }}</span><br>
        <button @click="changeFullName">修改全名</button>
    </div>
</template>

<script setup lang = 'ts'>
    import {ref,computed} from 'vue'

    let firstName = ref("张")
    let lastName = ref("三")

    let fullName = computed({
    //     return firstName.value.slice(0,1).toUpperCase() +firstName.value.slice(1)+'-'+lastName.value
    // // 计算属性是一个只读属性，只能读不能改
    get(){
        return firstName.value.slice(0,1).toUpperCase() +firstName.value.slice(1)+'-'+lastName.value
    },
    set(val){
        const [str1,str2] = val.split('-')
        firstName.value = str1
        lastName.value = str2
    }
    // 从这里就可以实现修改
    })
    function changeFullName(){
        fullName.value = "Li-Si"
    }
</script>

<style scoped>
</style>