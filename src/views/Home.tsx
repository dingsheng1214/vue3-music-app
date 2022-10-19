import { defineComponent } from 'vue'
import { useUserStore } from '@/store'
import style from './Home.module.scss'

const Home = defineComponent({
  setup() {
    const userStore = useUserStore()
    return () => (
      <div class={style.wrapper}>
        <div class={style.title}>Home</div>
        username: {userStore.getUserInfo.username}
      </div>
    )
  },
})

export default Home
