import { createPinia } from 'pinia'
import { usePlayerStore } from './modules/player'

const store = createPinia()

export default store
export { usePlayerStore }
