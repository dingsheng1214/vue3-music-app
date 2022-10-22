import { defineComponent, ref, unref } from 'vue'
import style from './Empty.module.scss'

const Empty = defineComponent({
  name: 'Empty',
  setup: (props, { expose }) => {
    const title = ref<string>('抱歉, 没有结果...')
    const setTitle = (val: string) => {
      title.value = val
    }
    expose({ setTitle })
    return () => (
      <div class={style['no-result']}>
        <div class={style['no-result-content']}>
          <div class={style.icon}></div>
          <p class={style.text}>{unref(title)}</p>
        </div>
      </div>
    )
  },
})
export default Empty
