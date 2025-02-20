
import {reactive} from 'vue'
import axios from 'axios'

export default function(){
    let doglist = reactive([
        'https://images.dog.ceo/breeds/pembroke/n02113023_4796.jpg'
    ])
    
    async function addDog(){ 
        try {
            let result = await axios.get('https://dog.ceo/api/breed/pembroke/images/random')
            let result2 = result.data.message
            doglist.push(result2)
    
        } catch (error) {
            alert("小狗不见了")
        }
    }
    // 向外部返回对象
    return{doglist,addDog}
}