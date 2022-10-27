import { usePlayerStore } from '@/store';
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, onActivated, onDeactivated, ref, Ref, nextTick, watch, computed, unref } from 'vue'

BScroll.use(Slide)

export default function useMiniSlider(slideOptions?: Record<string, any>) {
  const playerStore = usePlayerStore()
  const slideWrapperRef = ref<HTMLElement | string>()
  const slider = ref<BScroll>()
  const currentIndex = computed(() => playerStore.currentIndex)

  watch(currentIndex, () => {
    if(slider.value) {
      slider.value.goToPage(unref(currentIndex), 0, 0)
    }
  })

  onMounted(() => {
    if (slideWrapperRef.value) {
      init()
    } else {
      watch(slideWrapperRef, (val) => {
        if(val) {
          init()
        }
      })
    }
  })

  function init() {
    console.log('slideOptions:', slideOptions);

      slider.value = new BScroll(slideWrapperRef.value!, {
        click: true,
        scrollX: true,
        scrollY: false,
        momentum: false,
        bounce: false,
        probeType: 2,
        slide: {
          autoplay: false,
          loop: true,
        }
      })
      slider.value.on('slideWillChange', (page: { pageX: number }) => {
        playerStore.setCurrentIndex(page.pageX)
      })

      slider.value.goToPage(currentIndex.value, 0, 0)
  }

  onUnmounted(() => {
    slider.value?.destroy()
  })

  onActivated(() => {
    slider.value?.enable()
    slider.value?.refresh()
  })

  onDeactivated(() => {
    slider.value?.disable()
  })

  return {
    slider,
    slideWrapperRef,
    currentPageIndex: currentIndex,
  }
}
