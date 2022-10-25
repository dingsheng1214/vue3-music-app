import { defineComponent, ref, unref, watch } from 'vue'
import style from './Player.module.scss'
import useAudio from './hooks/useAudio';
import usePlayer from './hooks/usePlayer';
const Player = defineComponent({
  name: 'Player',
  setup: (props, context) => {
    const audioRef= ref()
    const currentSongReady = ref(false)

    const { handleAudioPause, handleAudioCanPlay } = useAudio(currentSongReady)
    const {
      playing,
      fullScreen,
      currentSong,
      playerStore,
      handleNextSong,
      handlePrevSong,
      handleTogglePlay,
      handleFullScreen,
      handleChangeMode,
      handleTogglerFavorite,
      class_disabled,
      class_playIcon,
      class_modeIcon,
      class_favorite
    }= usePlayer(currentSongReady)

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
    // 监听播放状态->控制audio
    watch(playing, (val) => {
      const audio = unref(audioRef) as HTMLAudioElement
      if(val) audio.play()
      else audio.pause()
    })


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
                    <i class={unref(class_modeIcon)} onClick={handleChangeMode} />
                  </div>
                  <div class={[style.icon, style['i-left'], style[unref(class_disabled)]]}>
                    <i class="icon-prev" onClick={handlePrevSong} />
                  </div>

                  <div class={[style.icon, style['i-center'], unref(class_disabled)]}>
                    <i class={unref(class_playIcon)} onClick={handleTogglePlay} />
                  </div>
                  <div class={[style.icon, style['i-right'], unref(class_disabled)]}>
                    <i class="icon-next" onClick={handleNextSong} />
                  </div>
                  <div class={[style.icon, style['i-right'],]}>
                    <i class={class_favorite(unref(currentSong))} onClick={() => handleTogglerFavorite(unref(currentSong))} />
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
