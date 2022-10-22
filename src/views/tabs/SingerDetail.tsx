import { getSingerDetail } from '@/api/singer'
import { defineComponent, onMounted, PropType, ref, unref } from 'vue'
import style from './SingerDetail.module.scss'
import MusicList from '@/components/music-list/MusicList'
import { Singer, Song } from '#/global'

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
    onMounted(async () => {
      console.log('SingerDetail: ', singer.mid)

      const res = await getSingerDetail({ mid: singer.mid })
      songs.value = res.songs
    })
    return () => (
      <div class={style['singer-detail']}>
        <MusicList title={singer.name} pic={singer.pic} songs={unref(songs)} />
      </div>
    )
  },
})
export default SingerDetail
