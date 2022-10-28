import { defineComponent, onMounted, PropType, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import style from './TopList.module.scss'
import { getTopList } from '@/api/toplist'
import { TopItem } from '#/global'
import Scroll from '@/components/base/Scroll'
import { SongListRouterView } from './SongList'
import storage from '@/assets/js/storage/session'
import { TOP_KEY } from '@/assets/js/constant'

const TopList = defineComponent({
  name: 'TopList',
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup() {
    const topList = ref<TopItem[]>([])
    const scrollRef = ref()
    const selectedTop = ref()
    const router = useRouter()
    onMounted(async () => {
      const res = await getTopList()
      topList.value = res.topList
    })
    const goSongList = (top: TopItem) => {
      router.push({
        path: `/top-list/${top.id}`,
      })
      selectedTop.value = top
      storage.set(TOP_KEY, unref(selectedTop))
    }
    return () => (
      <div class={style['top-list']}>
        <Scroll ref={scrollRef} class={style['top-list-content']}>
          <ul>
            {unref(topList).map((item) => (
              <li class={style.item} onClick={() => goSongList(item)}>
                <div class={style.icon}>
                  <img src={item.pic} width="100" height="100" />
                </div>
                <div class={style.songs}>
                  {item.songList.slice(0, 3).map((song, index) => (
                    <div class={style.song}>
                      {index + 1}. {song.songName}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Scroll>
        <SongListRouterView data={unref(selectedTop)} />
      </div>
    )
  },
})
export default TopList
