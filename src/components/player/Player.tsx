import { computed, defineComponent, PropType, ref, unref, watch } from 'vue'
import style from './Player.module.scss'
import { usePlayerStore } from '@/store'
const Player = defineComponent({
  name: 'Player',
  setup: (props, context) => {
    const audioRef= ref()
    const playerStore = usePlayerStore()
    const fullScreen = computed(() => playerStore.fullScreen)
    const currentSong = computed(() => playerStore.currentSong)

    // 监听当前歌曲变化->自动播放
    watch(currentSong, (val) => {
      const song = unref(currentSong)
      const audio = unref(audioRef)!
      if(!val.id || !val.url) return
      audio.src = song.url
      audio.play()
    })
    const handleGoBack = () => {
      playerStore.setFullScreen(false)
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
                <div class={style.back} onClick={handleGoBack}>
                  <i class={['icon-back', style['player-icon-back']].join(' ')} />
                </div>
                <h1 class={style.title}>{unref(currentSong).name}</h1>
                <h2 class={style.subtitle}>{unref(currentSong).singer}</h2>
              </div>
            </div>
          </>
        )}
        <audio ref={audioRef} src=""></audio>
      </div>
    )
  },
})
export default Player
