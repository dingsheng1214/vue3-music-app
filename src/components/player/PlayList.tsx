import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  ref,
  Teleport,
  Transition,
  TransitionGroup,
  unref,
  watch,
} from 'vue'
import { PlayMode, Song } from '#/global'
import { usePlayerStore } from '@/store'
import Scroll from '@/components/base/Scroll'
import style from './PlayList.module.scss'

const PlayList = defineComponent({
  name: 'PlayList',
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  emits: ['close'],
  setup: (props, { emit }) => {
    const scrollRef = ref()
    const listRef = ref()
    const playerStore = usePlayerStore()
    const sequenceList = computed(() => playerStore.sequenceList)
    const playList = computed(() => playerStore.playList)
    const favoriteList = computed(() => playerStore.favoriteList)
    const playMode = computed(() => playerStore.playMode)
    const currentSong = computed(() => playerStore.currentSong)
    const playModeObj = ref({ mode: PlayMode.SEQUENCE, txt: '顺序播放', icon: 'icon-sequence' })

    watch(playMode, (mode) => {
      if (mode === PlayMode.SEQUENCE) {
        playModeObj.value = { mode, txt: '顺序播放', icon: 'icon-sequence' }
      } else if (mode === PlayMode.LOOP) {
        playModeObj.value = { mode, txt: '循环播放', icon: 'icon-loop' }
      } else {
        playModeObj.value = { mode, txt: '随机播放', icon: 'icon-random' }
      }
    })

    const scrollToCurrentSong = () => {
      const index = unref(sequenceList).findIndex((item) => item.id === unref(currentSong).id)
      const targetElement = unref(listRef).$el.children[index]
      unref(scrollRef).scrollTo(targetElement, 300)
    }

    watch(currentSong, async () => {
      await nextTick()
      scrollToCurrentSong()
    })

    onMounted(() => {
      if (unref(listRef) && unref(scrollRef)) {
        scrollToCurrentSong()
      }
    })

    const isFavorite = (song: Song) => {
      return unref(favoriteList).findIndex((item) => item.id === song.id) > -1
    }
    const isCurrentSong = (song: Song) => {
      return song.id === unref(currentSong).id
    }
    const changeMode = () => {
      const mode = (unref(playModeObj).mode + 1) % 3
      playerStore.changeMode(mode)
    }
    const deleteSong = (e: MouseEvent, song: Song) => {
      e.stopPropagation()
      playerStore.removeSong(song)
      if (!playList.value.length) {
        emit('close')
      }
    }

    const changeCurrentSong = (song: Song) => {
      const index = unref(sequenceList).findIndex((item) => item.id === song.id)
      playerStore.setCurrentIndex(index)
    }
    return () => (
      <Teleport to="body">
        <Transition
          enterFromClass={style['list-fade-enter-from']}
          enterActiveClass={style['list-fade-enter-active']}
          leaveToClass={style['list-fade-leave-to']}
          leaveActiveClass={style['list-fade-leave-active']}
        >
          <div class={style.playList} onClick={() => emit('close')}>
            <div class={style['list-wrapper']} onClick={(e) => e.stopPropagation()}>
              <div class={style['list-header']}>
                <h2 class={style.title}>
                  <i class={[unref(playModeObj).icon, style.icon]} onClick={changeMode} />
                  <span class={style['play-mode-text']}>{unref(playModeObj).txt}</span>
                  {/* <i class={[style['clear-icon'], 'icon-clear']}></i> */}
                </h2>
              </div>

              <Scroll class={style['list-content']} ref={scrollRef}>
                <TransitionGroup ref={listRef} tag="ul" name="list">
                  {unref(sequenceList).map((item) => (
                    <li class={style.item} key={item.id} onClick={() => changeCurrentSong(item)}>
                      <div>{isCurrentSong(item) && <i class={['icon-play']} />}</div>
                      <span>{item.name}</span>
                      <i
                        class={[isFavorite(item) ? 'icon-favorite' : 'icon-not-favorite']}
                        onClick={() => playerStore.toggleFavorite(item)}
                      />
                      <i class={['icon-delete']} onClick={(e) => deleteSong(e, item)} />
                    </li>
                  ))}
                </TransitionGroup>
              </Scroll>

              <div class={style['list-add']}>
                <div class={style.add}>
                  <i class="icon-add" />
                  <span class={style.text}>添加歌曲到队列</span>
                </div>
              </div>

              <div class={style['list-footer']}>
                <span onClick={() => emit('close')}>关闭</span>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    )
  },
})
export default PlayList
