import { ref } from 'vue'

type MiddleType = 'cd' | 'lyric'
type Touch = {
  startX: number
  startY: number
  percent: number
  // 方向锁
  directionLock: '' | 'h' | 'v'
}

function useMiddleAnimation() {
  // touchMove过程中就变化
  const currentShow = ref<MiddleType>('cd')
  // touchEnd才会发生变化
  let currentView: MiddleType = 'cd'
  const middleLStyle = ref()
  const middleRStyle = ref()

  // 在一次touch事件中共享

  let touch: Touch = {
    startX: 0,
    startY: 0,
    percent: 0,
    directionLock: '',
  }

  function onMiddleTouchStart(e: TouchEvent) {
    e.preventDefault()

    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
  }

  function onMiddleTouchMove(e: TouchEvent) {
    e.preventDefault()

    // 屏幕宽度
    const windowWidth = window.innerWidth
    // 当前移动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    // 方向锁, 当y轴变动大于x轴变动时 退出
    if (!touch.directionLock) {
      touch.directionLock = Math.abs(deltaX) >= Math.abs(deltaY) ? 'h' : 'v'
    }
    if (touch.directionLock === 'v') {
      return
    }

    // 初始偏移量, 当前视图为cd时,偏移量为0; 当前视图为lyric时,偏移量为屏幕宽度
    const left = currentView === 'cd' ? 0 : -windowWidth
    // 偏移量
    const offsetWidth = Math.min(0, Math.max(-windowWidth, left + deltaX))
    // 偏移比例
    touch.percent = Math.abs(offsetWidth / windowWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else if (touch.percent < 0.8) {
      currentShow.value = 'cd'
    } else {
      currentShow.value = 'lyric'
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms',
    }

    middleRStyle.value = {
      transform: `translateX(${offsetWidth}px)`,
      transitionDuration: '0ms',
    }
  }

  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    middleLStyle.value = {
      opacity,
      transitionDuration: '300ms',
    }
    middleRStyle.value = {
      transform: `translateX(${offsetWidth}px)`,
      transitionDuration: '300ms',
    }

    touch = {
      startX: 0,
      startY: 0,
      percent: 0,
      directionLock: '',
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  }
}

export default useMiddleAnimation
