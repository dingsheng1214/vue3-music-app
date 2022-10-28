import { Directive, createApp } from 'vue'
import Loading from '@/components/base/Loading'

const { name } = Loading
function append(el: any) {
  el.appendChild(el[name].$el)
}
function remove(el: any) {
  el.removeChild(el[name].$el)
}

const loading: Directive = {
  mounted(el, { value }) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el[name] = instance
    if (value) {
      // 加载中
      append(el)
    }
  },
  updated(el, { value, oldValue }) {
    if (!value && oldValue) {
      remove(el)
    }
  },
}

export default loading
