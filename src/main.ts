import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from './store'
import loading from '@/directives/loading'
import empty from '@/directives/empty'

import '@/assets/scss/index.scss'

createApp(App)
  .use(router)
  .use(store)
  .directive('loading', loading)
  .directive('empty', empty)
  .mount('#app')
