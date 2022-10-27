import useMiniSlider from '@/hooks/useMiniSlider'
import { usePlayerStore } from '@/store'
import { computed, defineComponent, onMounted, onRenderTracked, PropType, ref, Transition, unref, watch } from 'vue'
import { useCD } from './hooks'
import style from './MiniPlayer.module.scss'
const MiniPlayer = defineComponent({
  name: 'MiniPlayer',
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const playerStore = usePlayerStore()
    const currentIndex = computed(() => playerStore.currentIndex)
    const currentSong = computed(() => playerStore.currentSong)
    const fullScreen = computed(() => playerStore.fullScreen)
    const playing = computed(() => playerStore.playing)
    const playList = computed(() => playerStore.playList)

    const {
      cdImageRef,
      cdWrapperRef,
      calcCdWrapperTransform
    } = useCD()

    const { slideWrapperRef } = useMiniSlider()

    onMounted(() => {
      console.log('onMounted');
    })
    watch(playing, (val, old) => {
      if(!val && !unref(fullScreen)) {
        calcCdWrapperTransform(cdWrapperRef, cdImageRef)
      }
    })

    const handleMiniPlayerClick = (e: MouseEvent) => {
      playerStore.setFullScreen(true)
    }
    const handlePlayPauseIconClick = (e: MouseEvent) => {
      e.stopPropagation()
      playerStore.setPlayingState(!unref(playing))
    }

    return () => (
      <Transition name='mini'>
        {!unref(fullScreen) && unref(currentSong).id && (
          <div class={style['mini-player']} onClick={handleMiniPlayerClick}>
            <div class={style['cd-wrapper']} ref={cdWrapperRef}>
              <img
                src={unref(currentSong).pic}
                ref={cdImageRef}
                class={[unref(playing) ? style.playing : '']}
              />
            </div>
            <div class={style['slide-wrapper']} ref={slideWrapperRef}>
              <div class={style['slide-content']}>
                {
                  unref(playList).map(song => (
                    <div class={style['slide-page']}>
                      <h2 class={style.name}>{song.name}</h2>
                      <p class={style.singer}>{song.singer}</p>
                    </div>
                  ))
                }
              </div>
            </div>
            <div class={style.control}>
              <i
                onClick={handlePlayPauseIconClick}
                class={[style['icon-mini'], unref(playing) ? 'icon-pause-mini' : 'icon-play-mini']}
              />
            </div>
            <div class={style.control}>
              <i class={[style['icon-mini'], 'icon-playlist']}></i>
            </div>
          </div>
        )}
      </Transition>
    )
  },
})
export default MiniPlayer
