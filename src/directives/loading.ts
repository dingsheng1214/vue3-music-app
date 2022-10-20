import { Directive, createApp } from 'vue'
import Loading from '@/components/base/Loading'

function append(el: any) {
  el.appendChild(el.instance.$el)
}
function remove(el: any) {
  el.removeChild(el.instance.$el)
}

const loading: Directive = {
  mounted(el, { value }) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    if (value) {
      // 加载中
      append(el)
    }
  },
  updated(el, { value, oldValue }) {
    if (value !== oldValue) {
      if (value) append(el)
      else remove(el)
    }
  },
}

export default loading
