import {usePlayerStore} from '@/store';
import { computed, Ref, unref } from 'vue';
import { PlayMode, Song } from '#/global';

function usePlayer(currentSongReady: Ref<boolean>) {
  const playerStore = usePlayerStore()
  const playList = computed(() => playerStore.playList)
  const currentIndex = computed(() => playerStore.currentIndex)
  const playMode = computed(() => playerStore.playMode)
  const fullScreen = computed(() => playerStore.fullScreen)
  const currentSong = computed(() => playerStore.currentSong)
  const playing = computed(() => playerStore.playing)
  const favoriteList = computed(() => playerStore.favoriteList)

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

  const handleTogglerFavorite = (currentSong: Song) => {
    playerStore.toggleFavorite(currentSong)
  }

  /**
   * 播放/暂停 按钮切换
   */
  const class_playIcon = computed(() => {
    return unref(playing) ? 'icon-pause' : 'icon-play'
  })
  /**
   * 播放/暂停/上一首/下一首/模式 按钮是否可用
   */
  const class_disabled = computed(() => {
    return unref(currentSongReady) ? '' : 'disable'
  })
  /**
   * 顺序/随机/循环 按钮切换
   */
  const class_modeIcon = computed(() => {
    const mode = unref(playMode)
    return mode === PlayMode.SEQUENCE
      ? 'icon-sequence'
      : mode === PlayMode.LOOP
      ? 'icon-loop'
      : 'icon-random'
  })
  /**
   * 判断当前歌曲是否在收藏列表中
   */
  const class_favorite = (song: Song) => {
    const isFavorite = unref(favoriteList).findIndex(item => item.id === song.id) > -1
    return isFavorite ? 'icon-favorite' : 'icon-not-favorite'
  }

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
    handleTogglerFavorite,
    class_disabled,
    class_modeIcon,
    class_playIcon,
    class_favorite
  }
}

export default usePlayer
