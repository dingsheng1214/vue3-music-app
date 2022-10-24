import {usePlayerStore} from '@/store';
import { computed, Ref, unref } from 'vue';
import { PlayMode as PlayModeType } from '#/global';

function usePlayer(currentSongReady: Ref<boolean>) {
  const playerStore = usePlayerStore()
  const playList = computed(() => playerStore.playList)
  const currentIndex = computed(() => playerStore.currentIndex)
  const playMode = computed(() => playerStore.playMode)
  const fullScreen = computed(() => playerStore.fullScreen)
  const currentSong = computed(() => playerStore.currentSong)
  const playing = computed(() => playerStore.playing)

  /**
   * 最小化
   */
  const handleFullScreen = () => {
    playerStore.setFullScreen(false)
  }
  /**
   * 播放/暂停
   */
  const handleTogglePlay = () => {
    if (!unref(currentSongReady)) return
    playerStore.setPlayingState(!playerStore.playing)
  }

  /**
   * 下一首
   */
  const handleNextSong = () => {
    if (!unref(currentSongReady)) return
    if (!unref(playList).length) return
    // 最后一首 跳到第一首
    let nextIndex = 0
    if (unref(currentIndex) < unref(playList).length - 1) {
      nextIndex = unref(currentIndex) + 1
    }
    playerStore.setCurrentIndex(nextIndex)
  }
  /**
   * 上一首
   */
  const handlePrevSong = () => {
    if (!unref(currentSongReady)) return
    if (!unref(playList).length) return
    // 第一首 跳到最后一首
    let prevIndex = unref(playList).length - 1
    if (unref(currentIndex) > 0) {
      prevIndex = unref(currentIndex) - 1
    }
    playerStore.setCurrentIndex(prevIndex)
  }
  /**
   * 播放模式切换
   */
  const handleChangeMode = () => {
    const mode = (unref(playMode) + 1) % 3
    playerStore.changeMode(mode)
  }

  /**
   * 样式相关
   */
  const class_playIcon = computed(() => {
    return unref(playing) ? 'icon-pause' : 'icon-play'
  })
  const class_disabled= computed(() => {
    return unref(currentSongReady) ? '' : 'disable'
  })
  const class_modeIcon= computed(() => {
    const mode = unref(playMode)

    return mode === PlayModeType.SEQUENCE
      ? 'icon-sequence'
      : mode === PlayModeType.LOOP
      ? 'icon-loop'
      : 'icon-random'
  })

  return {
    playerStore,
    playing,
    playMode,
    playList,
    fullScreen,
    currentIndex,
    currentSong,
    handleNextSong,
    handlePrevSong,
    handleTogglePlay,
    handleChangeMode,
    handleFullScreen,
    class_disabled,
    class_modeIcon,
    class_playIcon
  }
}

export default usePlayer
