import { defineComponent } from 'vue'

const App = defineComponent({
  setup() {
    return () => {
      return <router-view />
    }
  },
})
export default App
