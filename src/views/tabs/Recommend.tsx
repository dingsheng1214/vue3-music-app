import { defineComponent, onMounted, ref, unref } from 'vue'
import { getRecommend } from '@/api/recommend'
import Slider from '@/components/base/Slider'
import Scroll from '@/components/base/Scroll'
import { Slide, Album } from '#/global'
import style from './Recommend.module.scss'

const Recommend = defineComponent({
  name: 'Recommend',
  setup() {
    const sliderList = ref<Slide[]>([])
    const albumList = ref<Album[]>([])
    onMounted(async () => {
      const { sliders, albums } = await getRecommend()
      sliderList.value = sliders
      albumList.value = albums
    })
    return () => (
      <div class={style.recommend}>
        <Scroll class={style['recommend-content']}>
          {{
            default: () => (
              <div>
                <div class={style['slider-wrapper']}>
                  <div class={style['slider-content']}>
                    {unref(sliderList).length && <Slider sliders={unref(sliderList)} />}
                  </div>
                </div>
                <div class={style['recommend-list']}>
                  <h1 class={style['list-title']}>热门歌单推荐</h1>
                  {unref(albumList).map((album) => (
                    <div class={style.item}>
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
      </div>
    )
  },
})

export default Recommend
