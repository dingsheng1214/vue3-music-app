import { Song, Album } from '#/global';
import { processSongs } from '@/api/singer';
import { computed, defineComponent, h, onMounted, PropType, ref, resolveDirective, unref, withDirectives, VNode, Transition } from 'vue';
import { useRoute, useRouter, RouterView, RouteLocationNormalizedLoaded } from 'vue-router';
import storage from '@/assets/js/storage/session';
import MusicList from '@/components/music-list/MusicList';
import style from './SongList.module.scss';

type T = {
  id?: number
  mid?: string
  name?: string
  title?: string
  pic: string
}
function getSongList(name: string, key: string, fetch: Function) {
  const SongList = defineComponent({
    name,
    props: {
      data: {
        type: Object as PropType<T>,
        default: () => {}
      }
    },
    setup: ({data}, context) => {
      const songs = ref<Song[]>([])
      const route = useRoute()
      const router = useRouter()
      const computedData = computed(() => {
        if(data) return data
        const cachedData = <T>storage.init(key, {})
        if(cachedData && route.params.id === (cachedData.mid || cachedData.id + '')) {
          return cachedData
        }
        return null
      })
      const loading = ref(true)
      const empty = ref(false)
      onMounted(async () => {
        if(!unref(computedData)) {
          router.push({
            path: route.matched[0].path
          })
        }
        if(computedData.value !== null) {

          const res = await fetch(data)
          songs.value = await processSongs(res.songs)
          loading.value = false
          if(res.songs.length <= 0) {
            empty.value = true
          }
        }
      })
      return () => {
        const vLoading = resolveDirective('loading')
        const vEmpty = resolveDirective('empty')
        const musicListVNode = withDirectives(h(MusicList, {
            title: unref(computedData)?.title,
            pic: unref(computedData)?.pic,
            songs: unref(songs)
          }),[
            [vLoading!, unref(loading)],
            [vEmpty!, unref(empty)]
          ]
        )
        return h('div', {
          class: style['singer-detail'],
        },
        [
          musicListVNode
        ]
      )
    }
    }
  })

  return SongList
}



const SongListRouterView = defineComponent({
    name: 'SongListRouterView',
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    setup: (props, context) => {
      return () => (
        h(
          RouterView,
          null,
          {
            default: ({ Component: X, route: R}: {Component: VNode, route: RouteLocationNormalizedLoaded}) => {
              console.log('RouterView default: ', props.data, X);
              if(X !== undefined && props.data !== undefined) {
                // 给路由激活组件 传递props
                X!.props!.data= props.data
              }
              return (
                h(Transition, {name: 'slide'},
                  {default: () => X}
                )
              )
            }
          }
        )
      )
    }
  })

export { getSongList,  SongListRouterView}

