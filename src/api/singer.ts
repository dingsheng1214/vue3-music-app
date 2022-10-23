import { Song } from '#/global'
import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer: { mid: string}) {
  return get('/api/getSingerDetail', {
    mid: singer.mid,
  })
}

export function processSongs(songs: Song[]) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}
