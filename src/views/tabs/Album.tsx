import { computed, defineComponent, onMounted, PropType, ref, unref } from 'vue';
import { getAlbum } from '@/api/recommend';
import { processSongs } from '@/api/singer'
import style from './SingerDetail.module.scss';
import { useRoute, useRouter } from 'vue-router';
import MusicList from '@/components/music-list/MusicList';
import { Album as AlbumType, Song} from '#/global';
import storage from '@/assets/js/storage/session';
import { ALBUM_KEY } from '@/assets/js/constant';

const Album = defineComponent({
  name: 'Album',
  props: {
    album: {
      type: Object as PropType<AlbumType>,
      default: () => {}
    },
  },
  setup: ({album}, context) => {
    const songs = ref<Song[]>([])
    const route = useRoute()
    const router = useRouter()
    const computedSinger = computed(() => {
      if(album) return album
      const cachedSinger = storage.init(ALBUM_KEY, {}) as AlbumType
      if(cachedSinger) {
        return cachedSinger
      }
      return null
    })
    const loading = ref(true)
    const empty = ref(false)
    onMounted(async () => {
      if(!unref(computedSinger)) {
        router.push({
          path: route.matched[0].path
        })
      }
      if(computedSinger.value !== null) {
        const res = await getAlbum({ id: computedSinger.value.id })
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
          title={unref(computedSinger)?.title}
          pic={unref(computedSinger)?.pic}
          songs={unref(songs)}
          v-loading={unref(loading)}
          v-empty={unref(empty)}
        />
      </div>
    )
  },
})
export default Album
