import { defineComponent } from 'vue'
import Header from '@/components/header/Header'
import Tab from '@/components/tab/Tab'

const App = defineComponent({
  setup() {
    return () => (
      <>
        <Header />
        <Tab />
        <router-view />
      </>
    )
  },
})

export default App
