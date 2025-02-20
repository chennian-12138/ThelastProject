import {ref} from 'vue'

export default function(){
    let sum = ref(0)

    function add(){
        sum.value +=1
    }
    // 向外部暴露的东西
    return{sum,add}
}
