import { watch, computed, unref, ref, Ref } from 'vue';
import { usePlayerStore } from '@/store';
import { getLyric } from '@/api/singer';
import { time_to_sec } from '@/assets/js/util';

type LyricLine = {
  line: number,
  time: number,
  txt: string
}
function useLyric(currentTime: Ref<number>) {
  const lyricScrollRef = ref()
  const lyricListRef = ref()

  const playerStore = usePlayerStore()
  const currentSong = computed(() => playerStore.currentSong)

  const currentLyric = ref<LyricLine[]>([])
  const currentLine = ref(1)

  //监听currentSong变化,自动获取歌词并解析
  watch(currentSong, async (val, old) => {
    if(!val || !val.id) {
      return
    }

    const lyric = await getLyric(val)
    playerStore.setSongLyric(val, lyric)

    if(unref(currentSong).lyric !== lyric) {
      return
    }
    currentLyric.value = lyricParse(lyric)
  })

  // 监听currentTime 播放进度, 高亮当前歌词所在行,并滚动歌词列表
  watch(currentTime, (val, old) => {
    const lyricLine = unref(currentLyric).find(item => item.time > val)
    currentLine.value = lyricLine?.line! - 1
    lyricScroll()
  })

  /**
   * 滚动歌词
   * @returns
   */
  function lyricScroll() {
    if(!unref(lyricListRef)) {
      return
    }

    // 一屏能放几行歌词,获取中间行号
    const lyricWrapperHeight = unref(lyricListRef).parentElement.parentElement.clientHeight
    const canWrapperedLines = Math.floor(lyricWrapperHeight / 32)
    const centerLine = Math.floor(canWrapperedLines / 2) + 1
    if(unref(currentLine) > centerLine) {
      const currentLineEl = unref(lyricListRef).children[unref(currentLine) - centerLine ]
      unref(lyricScrollRef).scrollTo(currentLineEl, 1000)
    }
  }

  /**
   * 解析歌词
   * @param lyric
   * @returns
   */
  function lyricParse(lyric: string) {
    let lines: string[] = lyric.split('\n')
    const offsetIndex = lines.findIndex(line => line === '[offset:0]')
    lines = lines.slice(offsetIndex + 1)

    lines = lines.filter(item => item.slice(10) !== '')

    const res = lines.map((item, index) => {
      const line = index + 1
      const time = time_to_sec(item.slice(1,9))
      const txt = item.slice(10)
      return {line, time, txt}
    })
    console.log(res);
    return res
  }
  return {
    currentLine,
    currentLyric,
    lyricListRef,
    lyricScrollRef
  }
}

export default useLyric
