import { defineComponent } from 'vue'
import style from './Header.module.scss'

const Header = defineComponent({
  name: 'm-header',
  setup() {
    return () => (
      <div class={style.header}>
        <span class={style.icon}></span>
        <h1 class={style.text}>DS Music</h1>
      </div>
    )
  },
})

export default Header
