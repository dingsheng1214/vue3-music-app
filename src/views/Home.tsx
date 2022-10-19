import { defineComponent } from 'vue'
import Header from '@/components/header/Header'

const Home = defineComponent({
  setup() {
    return () => (
      <>
        <Header />
      </>
    )
  },
})

export default Home
