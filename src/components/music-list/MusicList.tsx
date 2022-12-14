import { computed, defineComponent, onMounted, PropType, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { Song } from '#/global'
import Scroll from '../base/Scroll'
import style from './MusicList.module.scss'
import SongList from '@/components/song-list/SongList'
import { usePlayerStore } from '@/store'

const MusicList = defineComponent({
  name: 'MusicList',
  props: {
    title: {
      type: String as PropType<string>,
    },
    pic: {
      type: String as PropType<string>,
    },
    songs: {
      type: Array as PropType<Song[]>,
    },
    rank: {
      type: Boolean as PropType<boolean>,
      default: () => false,
    },
  },
  setup: (props) => {
    const router = useRouter()
    const scrollY = ref<number>(0)
    const maxScrollY = ref<number>(0)
    const bgImageRef = ref()
    const bgImageHeight = ref<number>(0)
    const bgImageStyle = computed(() => {
      // 通过设置padding-top: 70% 可以得到一个宽高比 10：7 的盒子
      let paddingTop = '70%'
      let height = '0px'
      let zIndex = 0
      let scale = 1
      let translateZ = 0
      if (unref(scrollY) > unref(maxScrollY)) {
        // 上滑 歌曲列表顶部 触碰到title 底部，此时 提升title层级 就能盖住歌曲列表
        zIndex = 10 //
        height = '40px'
        paddingTop = '0px'
        translateZ = 1
      }

      if (unref(scrollY) < 0) {
        // 下拉 图片放大
        scale = 1 + Math.abs(unref(scrollY) / unref(bgImageHeight))
      }
      return {
        zIndex,
        height,
        paddingTop,
        backgroundImage: `url(${props.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`,
      }
    })
    const filterStyle = computed(() => {
      let blur = 0
      // 上滑时 bg-image 模糊
      if (unref(scrollY) >= 0) {
        blur =
          Math.min(
            unref(maxScrollY) / unref(bgImageHeight),
            unref(scrollY) / unref(bgImageHeight),
          ) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      }
    })
    const scrollStyle = computed(() => {
      return {
        top: `${unref(bgImageHeight)}px`,
      }
    })
    const playBtnStyle = computed(() => {
      let display = ''
      if (unref(scrollY) >= unref(maxScrollY)) {
        display = 'none'
      }
      return { display }
    })
    onMounted(() => {
      bgImageHeight.value = unref(bgImageRef).clientHeight
      maxScrollY.value = unref(bgImageHeight) - 40
    })
    const onScroll = (pos: { x: number; y: number }) => {
      scrollY.value = -pos.y
    }

    const { selectPlay, randomPlay } = usePlayerStore()
    const onItemClick = ({ list, index }: { list: Song[]; index: number }) => {
      selectPlay(list, index)
    }
    const onRandomPlay = () => {
      randomPlay(props.songs!)
    }
    const goBack = () => {
      router.go(-1)
    }
    return () => (
      <div class={style['music-list']}>
        <div class={style.back} onClick={goBack}>
          <i class={['icon-back', style['back-icon']].join(' ')}></i>
        </div>
        <h1 class={style.title}>{props.title}</h1>
        <div ref={bgImageRef} class={style['bg-image']} style={unref(bgImageStyle)}>
          {props.songs?.length! > 0 && (
            <div
              class={style['play-btn-wrapper']}
              style={unref(playBtnStyle)}
              onClick={onRandomPlay}
            >
              <div class={style['play-btn']}>
                <i class="icon-play"></i>
                <span class={style.text}>随机播放全部</span>
              </div>
            </div>
          )}
          <div class={style.filter} style={unref(filterStyle)}></div>
        </div>
        <Scroll
          class={style.list}
          style={unref(scrollStyle)}
          options={{ probeType: 3 }}
          onScroll={onScroll}
        >
          {{
            default: () => (
              <div class={style['song-list-wrapper']}>
                <SongList songs={props.songs} onItemClick={onItemClick} rank={props.rank} />
              </div>
            ),
          }}
        </Scroll>
      </div>
    )
  },
})
export default MusicList
