/* eslint-disable no-use-before-define */
import { computed, defineComponent, nextTick, ref, unref, watch } from 'vue'
import SearchInput from '@/components/search/SearchInput'
import style from './Search.module.scss'
import { search } from '@/api/search'
import { processSongs } from '@/api/singer'
import SearchList from '@/components/search/SearchList'
import { Song } from '#/global'
import usePullUpLoad from '@/components/search/use-pull-up'
import { usePlayerStore } from '@/store'

function debounce(delay: number, fn: Function) {
  let timerId: any
  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn()
    }, delay)
  }
}
const Search = defineComponent({
  name: 'Search',
  setup() {
    const query = ref('')
    const page = ref(100)
    const hasMore = ref(true)

    const manualLoading = ref(false)
    const searchList = ref<Song[]>([])
    const loading = ref(false)
    const playerStore = usePlayerStore()
    const onModelChange = (val: string) => {
      query.value = val
    }

    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })
    /**
     * 重置
     */
    const reset = () => {
      page.value = 100
      searchList.value = []
      hasMore.value = true
    }
    /**
     * 查询
     */
    const getSearchResult = async () => {
      loading.value = true
      const res = await search(query.value, page.value, hasMore.value)
      searchList.value = await processSongs(res.songs)
      hasMore.value = res.hasMore
      loading.value = false
    }
    /**
     * 首次查询
     */
    const searchFirst = async () => {
      reset()
      await getSearchResult()
    }

    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        // eslint-disable-next-line no-use-before-define
        await searchMore()
        manualLoading.value = false
      }
    }
    const searchMore = async () => {
      if (!hasMore.value || !query.value) {
        return
      }
      page.value++
      await getSearchResult()
      await nextTick()
      await makeItScrollable()
    }

    const { rootRef, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)
    const handle = debounce(300, searchFirst)

    watch(query, (val) => {
      console.log('val', val)

      if (!val) {
        reset() // 清空
      } else {
        handle()
      }
    })

    const selectSong = (song: Song) => {
      playerStore.addSong(song)
    }

    return () => (
      <div class={style.search}>
        <SearchInput onUpdate:modelValue={onModelChange} modelValue={unref(query)} />
        {unref(searchList).length ? (
          <SearchList searchResult={unref(searchList)} ref={rootRef} onSelectSong={selectSong} />
        ) : null}
      </div>
    )
  },
})

export default Search
