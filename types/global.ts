/**
 * 轮播图
 */
export type Slide = {
  id: string
  link: string
  pic: string
}
/**
 * 专辑
 */
export type Album = {
  id: number
  pic: string
  title: string
  username: string
}
/**
 * 歌手
 */
export type Singer = {
  id: number
  mid: string
  name: string
  pic: string
}
/**
 * 歌曲
 */
export type Song = {
  id: number
  mid: string
  name: string
  pic: string
  singer: string
  url: string
  duration: number
  album: string,
  lyric?: string
}

/**
 * 播放器模式
 */
export const enum PlayMode {
  SEQUENCE = 0,
  LOOP = 1,
  RANDOM = 2
}
