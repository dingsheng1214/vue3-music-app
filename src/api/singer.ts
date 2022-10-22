import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer: { mid: string}) {
  return get('/api/getSingerDetail', {
    mid: singer.mid,
  })
}
