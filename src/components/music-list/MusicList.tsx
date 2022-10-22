import { Song } from '#/global';
import { computed, defineComponent, onMounted, PropType, ref, unref } from 'vue';
import Scroll from '../base/Scroll';
import style from './MusicList.module.scss';
import SongList from '@/components/song-list/SongList';
const MusicList = defineComponent({
  name: 'MusicList',
  props: {
    title: {
      type: String as PropType<string>
    },
    pic: {
     type: String as PropType<string>
    },
    songs: {
      type: Array as PropType<Song[]>
    }
  },
  setup: (props, context) => {
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
      if(unref(scrollY) > unref(maxScrollY)) {
        // 上滑 歌曲列表顶部 触碰到title 底部，此时 提升title层级 就能盖住歌曲列表
        zIndex = 10 //
        height = '40px'
        paddingTop = '0px'
        translateZ = 1
      }

      if(unref(scrollY) < 0) {
        // 下拉 图片放大
        scale = 1 + Math.abs(unref(scrollY) / unref(bgImageHeight))
      }
      return {
        zIndex,
        height,
        paddingTop,
        backgroundImage: `url(${props.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    })
    const filterStyle = computed(() => {
      let blur = 0
      // 上滑时 bg-image 模糊
      if (unref(scrollY) >= 0) {
        blur = Math.min(unref(maxScrollY) / unref(bgImageHeight), unref(scrollY )/ unref(bgImageHeight)) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    })
    const scrollStyle = computed(() => {
      return {
        top: `${unref(bgImageHeight)}px`
      }
    })
    onMounted(() => {
      bgImageHeight.value = unref(bgImageRef).clientHeight
      maxScrollY.value = unref(bgImageHeight) - 40
    })
    const onScroll = (pos: {x: number, y: number}) => {
      console.log('onScroll', pos);
      scrollY.value = -pos.y
    }
    return () => (
      <div class={style['music-list']}>
        <div class={style.back}>
          <i class={['icon-back', style['back-icon']].join(' ')}></i>
        </div>
        <h1 class={style.title}>{props.title}</h1>
        <div ref={bgImageRef} class={style['bg-image']} style={unref(bgImageStyle)}>
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
                <SongList songs={props.songs} v-empty={props.songs?.length! <= 0} />
              </div>
            ),
          }}
        </Scroll>
      </div>
    )
  }
})
export default MusicList
