import ObserveDOM from '@better-scroll/observe-dom'
import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref, Ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(
  wrapperRef: Ref<HTMLElement | string>,
  options?: Record<string, any>,
  emit?: any,
) {
  const scroll = ref<BScroll>()

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options,
    })

    if (options?.probeType > 0) {
      scroll.value.on('scroll', (pos: any) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })

  onActivated(() => {
    scroll.value?.enable()
    scroll.value?.refresh()
  })

  onDeactivated(() => {
    scroll.value?.disable()
  })

  return scroll
}
