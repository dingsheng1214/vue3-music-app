import { computed, defineComponent, onMounted, PropType, ref, unref, watch } from 'vue'
import style from './ProgressBar.module.scss'

const progressBtnWidth = 16
const ProgressBar = defineComponent({
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number as PropType<number>, // 进度条比例0-1
      default: () => 0,
    },
  },
  emits: ['touchStart', 'touchMove', 'touchEnd', 'click'],
  setup: (props, { emit }) => {
    const offset = ref(0)
    const progressRef = ref<HTMLElement>()
    let barWidth: number
    let progressBarLeft: number

    onMounted(() => {
      const progressEl = unref(progressRef)
      if (progressEl) {
        barWidth = progressEl.clientWidth - progressBtnWidth
        progressBarLeft = progressEl.getBoundingClientRect().left!
      }
    })

    const setOffset = () => {
      const progressEl = unref(progressRef)
      let res = 0
      if (progressEl) {
        const barWidth = progressEl.clientWidth - progressBtnWidth
        res = barWidth * props.progress
      }
      return res
    }
    // 监听progress,更新偏移量
    watch(props, () => {
      offset.value = setOffset()
    })

    const processOffsetStyle = computed(() => ({ width: `${unref(offset)}px` }))
    const processBtnOffsetStyle = computed(() => ({ transform: `translateX(${unref(offset)}px)` }))

    const handleTouchStart = () => {
      emit('touchStart')
    }

    const handleTouchMove = (e: TouchEvent) => {
      const moveWidth = e.changedTouches[0].clientX - progressBarLeft
      // 进度控制在0-1之间
      const progress = Math.min(1, Math.max(moveWidth / barWidth, 0))
      emit('touchMove', progress)
    }

    const handleTouchEnd = () => {
      emit('touchEnd')
    }

    const handleClick = (e: MouseEvent) => {
      const moveWidth = e.pageX - progressBarLeft
      const progress = Math.min(1, Math.max(moveWidth / barWidth, 0))
      emit('click', progress)
    }
    return () => (
      <div ref={progressRef} class={style['progress-bar']} onClick={handleClick}>
        <div class={style['bar-inner']}>
          <div class={style.progress} style={unref(processOffsetStyle)}>
            <div
              class={style['progress-btn-wrapper']}
              onTouchstart={handleTouchStart}
              onTouchmove={handleTouchMove}
              onTouchend={handleTouchEnd}
            >
              <div class={style['progress-btn']} style={unref(processBtnOffsetStyle)}></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
export default ProgressBar
