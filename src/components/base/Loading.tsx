import { defineComponent, ref, unref } from 'vue'
import loadingGif from '@/assets/images/loading.gif'
import style from './Loading.module.scss'

const Loading = defineComponent({
  name: 'Loading',
  setup: (props, { expose }) => {
    const title = ref<string>('正在载入')
    const setTitle = (val: string) => {
      title.value = val
    }
    expose({ setTitle })
    return () => (
      <div class={style.loading}>
        <div class={style['loading-content']}>
          <img src={loadingGif} />
          <p class={style.desc}>{unref(title)}</p>
        </div>
      </div>
    )
  },
})
export default Loading
