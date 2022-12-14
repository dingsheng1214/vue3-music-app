import { defineComponent, onMounted, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommend } from '@/api/recommend'
import Slider from '@/components/base/Slider'
import Scroll from '@/components/base/Scroll'
import { Slide, Album } from '#/global'
import style from './Recommend.module.scss'
import storage from '@/assets/js/storage/session'
import { ALBUM_KEY } from '@/assets/js/constant'
import { SongListRouterView } from './SongList'

const Recommend = defineComponent({
  name: 'Recommend',
  setup() {
    const loading = ref<boolean>(true)
    const sliderList = ref<Slide[]>([])
    const albumList = ref<Album[]>([])
    const selectedAlbum = ref<Album>()
    const router = useRouter()
    onMounted(async () => {
      const { sliders, albums } = await getRecommend()
      loading.value = false
      sliderList.value = sliders
      albumList.value = albums
    })
    const toAlbum = (album: Album) => {
      router.push({
        path: `/recommend/${album.id}`,
      })
      selectedAlbum.value = album
      storage.set(ALBUM_KEY, unref(selectedAlbum))
    }
    return () => (
      <div class={style.recommend} v-loading={unref(loading)}>
        <Scroll class={style['recommend-content']}>
          {{
            default: () => (
              <div>
                <div class={style['slider-wrapper']}>
                  <div class={style['slider-content']}>
                    {unref(sliderList).length ? <Slider sliders={unref(sliderList)} /> : null}
                  </div>
                </div>
                <div class={style['recommend-list']}>
                  <h1 class={style['list-title']} v-show={!unref(loading)}>
                    热门歌单推荐
                  </h1>
                  {unref(albumList).map((album) => (
                    <div class={style.item} onClick={() => toAlbum(album)}>
                      <div class={style.icon}>
                        <img src={album.pic} alt="" />
                      </div>
                      <div class={style.text}>
                        <h2 class={style.name}>{album.username}</h2>
                        <p class={style.title}>{album.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }}
        </Scroll>
        <SongListRouterView data={unref(selectedAlbum)} />
      </div>
    )
  },
})

export default Recommend
