import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, ComputedRef } from 'vue'

BScroll.use(ObserveDOM)
BScroll.use(PullUp)

export default function usePullUpLoad(
  requestData: Function,
  preventPullUpLoad: ComputedRef<boolean>,
) {
  const scroll = ref()
  const rootRef = ref<HTMLElement | string>()
  const isPullUpLoad = ref(false)

  async function pullingUpHandler() {
    if (preventPullUpLoad.value) {
      scroll.value?.finishPullUp()
      return
    }
    isPullUpLoad.value = true
    await requestData()
    scroll.value?.finishPullUp()
    scroll.value?.refresh()
    isPullUpLoad.value = false
  }
  onMounted(() => {
    console.log('rootRef', rootRef, scroll)

    if (rootRef.value) {
      scroll.value = new BScroll(rootRef.value, {
        pullUpLoad: true,
        observeDOM: true,
        click: true,
      })
      scroll.value.on('pullingUp', pullingUpHandler)
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

  return {
    scroll,
    rootRef,
    isPullUpLoad,
  }
}
