import { Directive, createApp } from 'vue'
import Empty from '@/components/base/Empty'

const { name } = Empty

function append(el: any) {
  el.appendChild(el[name].$el)
}
function remove(el: any) {
  el.removeChild(el[name].$el)
}

const empty: Directive = {
  mounted(el, { value }) {
    const app = createApp(Empty)
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

export default empty
