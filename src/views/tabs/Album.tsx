import { getSongList } from './SongList';
import { ALBUM_KEY } from '@/assets/js/constant';
import { getAlbum } from '@/api/recommend';

export default getSongList('Album', ALBUM_KEY, getAlbum)
