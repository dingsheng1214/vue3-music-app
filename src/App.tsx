import { defineComponent } from 'vue'
import Header from '@/components/header/Header'
import Tab from '@/components/tab/Tab'
import Player from '@/components/player/Player';

const App = defineComponent({
  setup() {
    return () => (
      <>
        <Header />
        <Tab />
        <router-view></router-view>
        <Player />
      </>
    )
  },
})

export default App
