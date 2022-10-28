import { computed, ref, Ref, unref } from 'vue'
import { usePlayerStore } from '@/store'
import { PlayMode, Song } from '#/global'

function usePlayer(
  audioRef: Ref<HTMLAudioElement | undefined>,
  currentSongReady: Ref<boolean>,
  moving: Ref<boolean>,
) {
  const playerStore = usePlayerStore()
  const playList = computed(() => playerStore.playList)
  const currentIndex = computed(() => playerStore.currentIndex)
  const playMode = computed(() => playerStore.playMode)
  const fullScreen = computed(() => playerStore.fullScreen)
  const currentSong = computed(() => playerStore.currentSong)
  const playing = computed(() => playerStore.playing)
  const favoriteList = computed(() => playerStore.favoriteList)
  const currentTime = ref(0)

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
   * 播放模式切换, 其实是切换的playList
   * loop: playList不变
   * sequence: playList -> sequenceList
   * random: playList -> 打乱后的sequenceList
   */
  const handleChangeMode = () => {
    const mode = (unref(playMode) + 1) % 3
    playerStore.changeMode(mode)
  }

  const handleTogglerFavorite = (_currentSong: Song) => {
    playerStore.toggleFavorite(_currentSong)
  }

  /**
   * Audio暂停事件
   */
  const handleAudioPause = () => {
    playerStore.setPlayingState(false)
  }

  /**
   * Audio canplay 事件
   * @param currentSongReady
   * @returns
   */
  const handleAudioCanPlay = () => {
    if (unref(currentSongReady)) return
    currentSongReady.value = true
  }

  const handleAudioTimeUpdate = (event: any) => {
    if (!unref(moving)) {
      currentTime.value = event.target.currentTime
    }
  }

  function loop() {
    const audioEl = audioRef.value
    audioEl!.currentTime = 0
    audioEl!.play()
    playerStore.setPlayingState(true)
  }
  const handleAudioEnded = () => {
    // 当前歌曲结束后根据播放模式播放下一首
    const { playMode } = playerStore
    if (playMode === PlayMode.LOOP) {
      loop()
    } else {
      handleNextSong()
    }
  }

  /**
   * 播放/暂停 按钮切换
   */
  const classPlayIcon = computed(() => {
    return unref(playing) ? 'icon-pause' : 'icon-play'
  })
  /**
   * 播放/暂停/上一首/下一首/模式 按钮是否可用
   */
  const classDisabled = computed(() => {
    return unref(currentSongReady) ? '' : 'disable'
  })
  /**
   * 顺序/随机/循环 按钮切换
   */
  const classModeIcon = computed(() => {
    const mode = unref(playMode)
    const tmp = {
      '0': 'icon-sequence',
      '1': 'icon-loop',
      '2': 'icon-random',
    }
    return tmp[mode]
  })
  /**
   * 判断当前歌曲是否在收藏列表中
   */
  const classFavorite = (song: Song) => {
    const isFavorite = unref(favoriteList).findIndex((item) => item.id === song.id) > -1
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
    currentTime,
    handleNextSong,
    handlePrevSong,
    handleTogglePlay,
    handleChangeMode,
    handleFullScreen,
    handleTogglerFavorite,
    handleAudioCanPlay,
    handleAudioPause,
    handleAudioTimeUpdate,
    handleAudioEnded,
    classDisabled,
    classModeIcon,
    classPlayIcon,
    classFavorite,
  }
}

export default usePlayer
