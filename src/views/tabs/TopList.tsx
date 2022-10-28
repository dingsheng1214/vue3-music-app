import { defineComponent, onMounted, PropType, ref, unref } from 'vue';
import style from './TopList.module.scss';
import { getTopList } from '@/api/toplist';
import { TopItem } from '#/global';
import Scroll from '@/components/base/Scroll';
const TopList = defineComponent({
  name: 'TopList',
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const topList = ref<TopItem[]>([])
    const scrollRef = ref()
    onMounted(async () => {
      const res = await getTopList()
      topList.value = res.topList
    })
    return () => (
      <div class={style['top-list']}>
        <Scroll ref={scrollRef} class={style['top-list-content']}>
          <ul>
            {
              unref(topList).map(item => (
                <li class={style.item}>
                  <div class={style.icon}>
                    <img src={item.pic} width="100" height="100" />
                  </div>
                  <div class={style.songs}>
                    {
                      item.songList.slice(0, 3).map((song, index) => (
                        <div class={style.song}>
                          {index + 1}. {song.songName}
                        </div>
                      ))
                    }
                  </div>
                </li>
              ))
            }
          </ul>
        </Scroll>
      </div>
    )
  }
})
export default TopList
