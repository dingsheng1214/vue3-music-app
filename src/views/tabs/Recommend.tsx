import { defineComponent, onMounted } from 'vue'
import { getRecommend } from '@/api/recommend'

const Recommend = defineComponent({
  name: 'Recommend',
  setup() {
    onMounted(async () => {
      const res = await getRecommend()
      console.log(res)
    })
    return () => <div>推荐</div>
  },
})

export default Recommend
