import { getSingerDetail, processSongs } from '@/api/singer'
import { computed, defineComponent, onMounted, PropType, ref, unref } from 'vue'
import style from './SingerDetail.module.scss'
import MusicList from '@/components/music-list/MusicList'
import { Singer, Song } from '#/global'
import { useRoute, useRouter } from 'vue-router'

const SingerDetail = defineComponent({
  name: 'SingerDetail',
  props: {
    singer: {
      type: Object as PropType<Singer>,
      default: () => {}
    },
  },
  setup: ({singer}, context) => {
    const songs = ref<Song[]>([])
    const route = useRoute()
    const router = useRouter()
    const computedSinger = computed(() => {
      if(singer) return singer
      const cachedSinger = JSON.parse(sessionStorage.getItem('__singer__')!) as Singer
      if(cachedSinger && route.params.mid === cachedSinger.mid) {
        return cachedSinger
      }
      return null
    })
    const loading = ref(true)
    const empty = ref(false)
    onMounted(async () => {
      console.log('SingerDetail...', unref(computedSinger));
      if(!unref(computedSinger)) {
        router.push({
          path: route.matched[0].path
        })
      }
      if(computedSinger.value !== null) {
        const res = await getSingerDetail({ mid: computedSinger.value.mid })
        songs.value = await processSongs(res.songs)
        loading.value = false
        if(res.songs.length <= 0) {
          empty.value = true
        }
      }
    })
    return () => (
      <div class={style['singer-detail']}>
        <MusicList
          title={unref(computedSinger)?.name}
          pic={unref(computedSinger)?.pic}
          songs={unref(songs)}
          v-loading={unref(loading)}
          v-empty={unref(empty)}
        />
      </div>
    )
  },
})
export default SingerDetail
