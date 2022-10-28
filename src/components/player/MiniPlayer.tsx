import { computed, defineComponent, PropType, ref, Transition, unref, watch } from 'vue'
import useMiniSlider from '@/hooks/useMiniSlider'
import { usePlayerStore } from '@/store'
import { useCD } from './hooks'
import style from './MiniPlayer.module.scss'
import PlayList from './PlayList'
import ProgressCircle from './ProgressCircle'

const MiniPlayer = defineComponent({
  name: 'MiniPlayer',
  props: {
    progress: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup: (props) => {
    const playerStore = usePlayerStore()
    const currentSong = computed(() => playerStore.currentSong)
    const fullScreen = computed(() => playerStore.fullScreen)
    const playing = computed(() => playerStore.playing)
    const playList = computed(() => playerStore.playList)
    const playListShow = ref(false)

    const { cdImageRef, cdWrapperRef, calcCdWrapperTransform } = useCD()

    const { slideWrapperRef } = useMiniSlider()

    watch(playing, (val) => {
      if (!val && !unref(fullScreen)) {
        calcCdWrapperTransform(cdWrapperRef, cdImageRef)
      }
    })

    const handleMiniPlayerClick = () => {
      playerStore.setFullScreen(true)
    }
    const handlePlayPauseIconClick = (e: MouseEvent) => {
      e.stopPropagation()
      playerStore.setPlayingState(!unref(playing))
    }

    const handlePlayListIconClick = (e: MouseEvent) => {
      e.stopPropagation()
      playListShow.value = true
    }
    const handlePlayListClose = () => {
      playListShow.value = false
    }
    return () => (
      <>
        <Transition name="mini">
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
                  {unref(playList).map((song) => (
                    <div class={style['slide-page']}>
                      <h2 class={style.name}>{song.name}</h2>
                      <p class={style.singer}>{song.singer}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div class={style.control}>
                <ProgressCircle radius={32} progress={props.progress}>
                  {{
                    default: () => (
                      <i
                        onClick={handlePlayPauseIconClick}
                        class={[
                          style['icon-mini'],
                          unref(playing) ? 'icon-pause-mini' : 'icon-play-mini',
                        ]}
                      />
                    ),
                  }}
                </ProgressCircle>
              </div>
              <div class={style.control}>
                <i
                  onClick={handlePlayListIconClick}
                  class={[style['icon-playList'], 'icon-playlist']}
                />
              </div>
            </div>
          )}
        </Transition>
        {unref(playListShow) && <PlayList onClose={handlePlayListClose} />}
      </>
    )
  },
})
export default MiniPlayer
