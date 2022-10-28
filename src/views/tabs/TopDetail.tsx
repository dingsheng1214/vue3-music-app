import { getSongList } from './SongList'
import { TOP_KEY } from '@/assets/js/constant'
import { getTopDetail } from '@/api/toplist'

export default getSongList('TopDetail', TOP_KEY, getTopDetail)
