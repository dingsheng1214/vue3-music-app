import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'

const Login = defineComponent({
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const handleLogin = () => {
      userStore.setUserInfo({
        userId: '1',
        username: 'tony',
        realName: 'tony',
        avatar: 'avatar',
      })
      router.push({
        path: '/home',
      })
    }
    return () => (
      <div>
        <div>Login</div>
        <button onClick={handleLogin}>登录</button>
      </div>
    )
  },
})

export default Login
