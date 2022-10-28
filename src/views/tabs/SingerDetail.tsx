import { getSongList } from './SongList'
import { SINGER_KEY } from '@/assets/js/constant'
import { getSingerDetail } from '@/api/singer'

export default getSongList('SingerDetail', SINGER_KEY, getSingerDetail)
