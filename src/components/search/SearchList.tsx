import { defineComponent, onMounted, PropType, TransitionGroup } from 'vue'
import { Song } from '#/global'
import style from './SearchList.module.scss'

const SearchList = defineComponent({
  name: 'SearchList',
  props: {
    searchResult: {
      type: Array as PropType<Song[]>,
      default: () => [],
    },
  },
  emits: ['selectSong'],
  setup: (props, { emit }) => {
    onMounted(() => {
      console.log('searchList', props.searchResult)
    })
    const onselect = (song: Song) => {
      emit('selectSong', song)
    }
    return () => (
      <div class={style['search-list']}>
        <TransitionGroup name="list" tag="ul">
          {props.searchResult.map((item) => (
            <li key={item.id} class={style['search-item']} onClick={() => onselect(item)}>
              <i class={['icon-music', style.icon]} />
              <span class={style.name}>{item.name}</span>
            </li>
          ))}
        </TransitionGroup>
      </div>
    )
  },
})
export default SearchList
