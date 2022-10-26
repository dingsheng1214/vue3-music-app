import { PlayMode, Song } from '#/global'
import { defineStore } from 'pinia'
import { shuffle } from '@/assets/js/util';
import storage from '@/assets/js/storage/local';
import { FAVORITE_KEY} from '@/assets/js/constant';

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
  fullScreen: boolean,
  /**
   * 收藏列表
   */
  favoriteList: Song[],
}

export const usePlayerStore = defineStore({
  id: 'app-player',
  state: (): PlayerState => {

    return {
      sequenceList: [],
      playList: [],
      playing: false,
      playMode: PlayMode.SEQUENCE,
      currentIndex: 0,
      fullScreen: false,
      favoriteList: storage.init(FAVORITE_KEY, [])
    }
  },
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
    setFavoriteSet(list: Song[]) {
      storage.set(FAVORITE_KEY, list)
      this.favoriteList = list
      return this
    },


    selectPlay(list: Song[], index: number) {
      this.setPlayMode(PlayMode.SEQUENCE)
        .setSequenceList(list)
        .setPlayList(list)
        .setPlayingState(true)
        .setFullScreen(true)
        .setCurrentIndex(index)
    },
    randomPlay(list: Song[]) {
      this.setPlayMode(PlayMode.RANDOM)
        .setSequenceList(list)
        .setPlayList(shuffle(list))
        .setPlayingState(true)
        .setFullScreen(true)
        .setCurrentIndex(0)
    },
    changeMode(mode: PlayMode) {
      let newPlayList = this.sequenceList
      if(mode === PlayMode.RANDOM) {
        newPlayList = shuffle(this.sequenceList)
      }

      const newCurrentIndex = newPlayList.findIndex(song => song.id === this.currentSong.id)
      this.setPlayList(newPlayList)
      this.setCurrentIndex(newCurrentIndex)
      this.setPlayMode(mode)
    },
    toggleFavorite(song: Song) {
      const localStorage_favoriteList = this.favoriteList
      const index = localStorage_favoriteList.findIndex(item => item.id === song.id)

      if(index > -1) {
        localStorage_favoriteList.splice(index, 1)
      } else {
        localStorage_favoriteList.push(song)
      }

      this.setFavoriteSet(localStorage_favoriteList)
    },
    setSongLyric(song: Song, lyric: string) {
      this.sequenceList.map(item => {
        if(item.id === song.id) {
          item.lyric = lyric
        }
      })
    }
  },
})
