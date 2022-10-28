import { computed, defineComponent, h, nextTick, onMounted, Ref, ref, resolveComponent, Transition, unref, VNode, watch } from 'vue'
import { getSingerList } from '@/api/singer'
import Scroll from '@/components/base/Scroll'
import { Singer as SingerType } from '#/global'
import style from './Singer.module.scss'
import { useRouter } from 'vue-router'
import storage from '@/assets/js/storage/session';
import { SINGER_KEY } from '@/assets/js/constant';
import { SongListRouterView } from './SongList'

type Singers = { title: string; list: SingerType[] }[]
function useFixed(singers: Ref<Singers>, singersRef: Ref) {
  const fixedTitle = ref<string>('')
  const fixedIndex = ref<number>(0)
  const scrollY = ref<number>(0)
  const listHeights = ref<number[]>([])

  const distanceToTop = ref<number>(0)
  const fixedTranslateY = ref<number>(0)

  // A -Z 的高度区间 [0, 100, 200, 300]
  function calculate() {
    listHeights.value.length = 0
    const list = singersRef.value.children
    let height = 0 // 开始区间
    listHeights.value.push(height)
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeights.value.push(height)
    }
  }

  // 回调函数，从BetterScroll 中获取实时的 下拉值
  function onScroll(pos: { x: number; y: number }) {
    // console.log('scroll', pos);
    scrollY.value = -pos.y
  }

  // 监听列表 更新listHeights
  watch(singers, async (val, old) => {
    // 数据发生变化后，回调函数内部dom还是没有发生变化，
    // nextTick: 等待下一次DOM更新刷新的工具方法
    await nextTick()
    calculate()
  })

  // 监听下拉距离 更新fixedTitle
  watch(scrollY, (val) => {
    const index = unref(listHeights).findIndex((item) => item > val)
    if (index >= 1) {
      // 下拉
      // console.log('顶点下', val, `落在下标 ${index - 1} ~ ${index}之间`);
      // console.log('距离顶部：', unref(listHeights)[index] - val);
      distanceToTop.value = unref(listHeights)[index] - val
      fixedTitle.value = unref(singers)[index - 1].title
      fixedIndex.value = index - 1

      const diff =
        unref(distanceToTop) > 0 && unref(distanceToTop) < 30 ? unref(distanceToTop) - 30 : 0
      fixedTranslateY.value = diff
    } else {
      // 上滑
      // console.log('顶点上...');
      fixedTitle.value = ''
      fixedIndex.value = 0
    }
  })
  return { singersRef, fixedTitle, fixedIndex, fixedTranslateY, onScroll }
}
function useShortcut(singers: Ref<Singers>, scrollRef: Ref, singersRef: Ref) {
  let oneTouch: { y1: number; y2: number; startIndex: number } = { y1: 0, y2: 0, startIndex: 0 }
  function scrollTo(index: number) {
    if (index >= 0 && index < unref(singers).length) {
      scrollRef.value.scrollTo(unref(singersRef).children[index])
    }
  }
  const onTouchstart = (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const element = e.target as HTMLElement
    const anchorIndex = parseInt(element.dataset.index!)
    scrollTo(anchorIndex)

    oneTouch.y1 = e.touches[0].pageY!
    oneTouch.startIndex = anchorIndex
  }
  const onTouchmove = (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    oneTouch.y2 = e.touches[0].pageY!
    const { y1, y2, startIndex } = oneTouch
    const delta = ((y2 - y1) / 18) | 0
    const anchorIndex = startIndex + delta
    scrollTo(anchorIndex)
  }
  const onTouchend = (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    oneTouch = { y1: 0, y2: 0, startIndex: 0 }
  }

  return { onTouchstart, onTouchmove, onTouchend }
}
const Singer = defineComponent({
  name: 'Singer',
  setup() {
    const singersRef = ref()
    const scrollRef = ref()
    const singers = ref<Singers>([])
    const selectedSinger = ref<SingerType>()
    const loading = computed(() => {
      return singers.value.length <= 0
    })
    const { fixedTitle, fixedIndex, fixedTranslateY, onScroll } = useFixed(singers, singersRef)
    const { onTouchstart, onTouchmove, onTouchend } = useShortcut(singers, scrollRef, singersRef)
    onMounted(async () => {
      const res = await getSingerList()
      singers.value = res.singers
    })

    const router = useRouter()
    const handleSingerSelect = (singer: SingerType) => {
      console.log('toSingerDetail', singer)
      router.push({
        path: `/singer/${singer.mid}`,
      })
      selectedSinger.value = singer
      storage.set(SINGER_KEY, unref(selectedSinger))
    }

    return () => (
      <div class={style.singer} v-loading={unref(loading)}>
        <Scroll
          ref={scrollRef}
          class={style['index-list']}
          options={{ probeType: 3 }}
          onScroll={onScroll}
        >
          {{
            default: () => (
              <>
                <ul ref={singersRef}>
                  {unref(singers).map((item) => (
                    <li class={style.group}>
                      <h2 class={style.title}>{item.title}</h2>
                      <ul>
                        {item.list.map((singer) => (
                          <li class={style.item} onClick={() => handleSingerSelect(singer)}>
                            <img class={style.avatar} src={singer.pic} />
                            <span class={style.name}>{singer.name}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                {unref(fixedTitle) === '' ? null : (
                  <div
                    class={style.fixed}
                    style={{ transform: `translateY(${unref(fixedTranslateY)}px)` }}
                  >
                    {unref(fixedTitle)}
                  </div>
                )}
                <div class={style.shortcut}>
                  <ul>
                    {unref(singers).map((item, index) => (
                      <li
                        onTouchstart={onTouchstart}
                        onTouchmove={onTouchmove}
                        onTouchend={onTouchend}
                        data-index={index}
                        class={[
                          style['shortcut-item'],
                          unref(fixedIndex) === index ? style['shortcut-item-active'] : '',
                        ].join(' ')}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ),
          }}
        </Scroll>
        <SongListRouterView data={unref(selectedSinger)} />
      </div>
    )
  },
})

export default Singer
