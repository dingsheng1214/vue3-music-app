import { computed, defineComponent, PropType, ref, unref, watch } from 'vue'
import style from './Player.module.scss'
import { usePlayerStore } from '@/store'
const Player = defineComponent({
  name: 'Player',
  setup: (props, context) => {
    const audioRef= ref()
    const currentSongReady = ref(false)
    const playerStore = usePlayerStore()
    const fullScreen = computed(() => playerStore.fullScreen)
    const currentSong = computed(() => playerStore.currentSong)
    const currentIndex = computed(() => playerStore.currentIndex)
    const playing = computed(() => playerStore.playing)
    const playList = computed(() => playerStore.playList)

    /**
     * 样式相关
     */
    const playIcon = computed(() => {
      return unref(playing) ? 'icon-pause' : 'icon-play'
    })
    const disabledClass = computed(() => {
      return unref(currentSongReady) ? '' : style.disable
    })

    // 监听当前歌曲变化->自动播放
    watch(currentSong, async (val) => {
      currentSongReady.value = false
      const song = unref(currentSong)
      const audio = unref(audioRef)!
      if(!val.id || !val.url) return
      audio.src = song.url
      await audio.play()
      playerStore.setPlayingState(true)
    })
    watch(playing, (val) => {
      const audio = unref(audioRef) as HTMLAudioElement
      if(val) audio.play()
      else audio.pause()
    })

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
     * 异常暂停
     */
    const handleAudioPause = () => {
      playerStore.setPlayingState(false)
    }
    const handleAudioCanPlay = () => {
      if(unref(currentSongReady)) return
      currentSongReady.value = true
    }
    /**
     * 下一首
     */
    const handleNextSong = () => {
      if (!unref(currentSongReady)) return
      if (!unref(playList).length) return
      // 最后一首 跳到第一首
      let nextIndex = 0
      if(unref(currentIndex) < unref(playList).length - 1)  {
        nextIndex = unref(currentIndex) + 1
      }
      playerStore.setCurrentIndex(nextIndex)
      // unref(audioRef).play()
    }
    /**
     * 上一首
     */
    const handlePrevSong = () => {
      if (!unref(currentSongReady)) return
      if (!unref(playList).length) return
      // 第一首 跳到最后一首
      let prevIndex = unref(playList).length - 1
      if(unref(currentIndex) > 0) {
        prevIndex = unref(currentIndex) - 1
      }
      playerStore.setCurrentIndex(prevIndex)
    }
    /**
     * 循环
     */
    const handleLoop = () => {

    }
    return () => (
      <div class={style.player}>
        {unref(fullScreen) && (
          <>
            <div class={style['normal-player']}>
              <div class={style.background}>
                <img src={unref(currentSong).pic} />
              </div>
              <div class={style.top}>
                <div class={style.back} onClick={handleFullScreen}>
                  <i class={['icon-back', style['player-icon-back']].join(' ')} />
                </div>
                <h1 class={style.title}>{unref(currentSong).name}</h1>
                <h2 class={style.subtitle}>{unref(currentSong).singer}</h2>
              </div>

              <div class={style.bottom}>
                <div class={style.operators}>
                  <div class={[style.icon, style['i-left']]}>
                    <i class="icon-sequence"/>
                  </div>
                  <div class={[style.icon, style['i-left'], unref(disabledClass)]}>
                    <i class="icon-prev" onClick={handlePrevSong} />
                  </div>

                  <div class={[style.icon, style['i-center'], unref(disabledClass)]}>
                    <i class={unref(playIcon)} onClick={handleTogglePlay} />
                  </div>
                  <div class={[style.icon, style['i-right'], unref(disabledClass)]}>
                    <i class="icon-next" onClick={handleNextSong} />
                  </div>
                  <div class={[style.icon, style['i-right']]}>
                    <i class="icon-not-favorite" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <audio
          ref={audioRef}
          onPause={handleAudioPause}
          onCanplay={handleAudioCanPlay}
        />
      </div>
    )
  },
})
export default Player
