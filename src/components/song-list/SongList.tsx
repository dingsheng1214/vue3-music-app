import { Song } from '#/global';
import { defineComponent, PropType } from 'vue';
import style from './SongList.module.scss';
const SongList = defineComponent({
  name: 'SongList',
  props: {
    songs: {
      type: Array as PropType<Song[]>,
      default: () => []
    }
  },
  emits:['itemClick'],
  setup: (props, {emit}) => {
    const onClick = (index: number) => {
      emit('itemClick', {list: props.songs, index})
    }
    return () => (
      <ul class={style['song-list']}>
        {
          props.songs.map((song, index) => (
            <li class={style.item} onClick={() => onClick(index)}>
              <div class={style.content}>
                <div class={style.name}>{song.name}</div>
                <div class={style.desc}>{song.singer}·{song.album}</div>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }
})
export default SongList
