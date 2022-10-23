import { Song } from '#/global'
import { defineStore } from 'pinia'
import { shuffle } from '@/assets/js/util';

type PlayMode = 0 | 1 | 2
export interface PlayerState {
  /**
   * 歌曲列表
   */
  sequenceList: Song[]
  /**
   * 真实播放列表
   */
  playList: Song[]
  /**
   * 是否正在播放
   */
  playing: boolean
  /**
   * 播放模式(0: 顺序播放， 1： 循环， 2：随机)
   */
  playMode: PlayMode
  /**
   * 当前播放歌曲索引
   */
  currentIndex: number
  /**
   * 全屏
   */
  fullScreen: boolean
}

export const usePlayerStore = defineStore({
  id: 'app-player',
  state: (): PlayerState => ({
    sequenceList: [],
    playList: [],
    playing: false,
    playMode: 0,
    currentIndex: 0,
    fullScreen: false
  }),
  getters: {
    /**
     * 当前播放歌曲
     */
    currentSong: (state) => {
      return state.playList[state.currentIndex] || {}
    }
  },
  actions: {
    setPlayingState(playing: boolean) {
      this.playing = playing
      return this
    },
    setSequenceList(list: Song[]) {
      this.sequenceList = list
      return this
    },
    setPlayList(list: Song[]) {
      this.playList = list
      return this
    },
    setPlayMode(mode: PlayMode) {
      this.playMode = mode
      return this
    },
    setCurrentIndex(index: number) {
      this.currentIndex = index
      return this
    },
    setFullScreen(full: boolean) {
      this.fullScreen = full
      return this
    },


    selectPlay(list: Song[], index: number) {
      this.setPlayMode(0)
        .setSequenceList(list)
        .setPlayList(list)
        .setPlayingState(true)
        .setFullScreen(true)
        .setCurrentIndex(index)
    },
    randomPlay(list: Song[]) {
      this.setPlayMode(2)
        .setSequenceList(list)
        .setPlayList(shuffle(list))
        .setPlayingState(true)
        .setFullScreen(true)
        .setCurrentIndex(0)
    },
  },
})
