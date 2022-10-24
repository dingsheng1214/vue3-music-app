import { usePlayerStore } from '@/store/modules/player'
import { Ref, unref } from 'vue'

function useAudio(currentSongReady: Ref<boolean>) {
  const playerStore = usePlayerStore()

  /**
   * Audio暂停事件
   */
  const handleAudioPause = () => {
    playerStore.setPlayingState(false)
  }

  /**
   * Audio canplay 事件
   * @param currentSongReady
   * @returns
   */
  const handleAudioCanPlay = () => {
    if (unref(currentSongReady)) return
    currentSongReady.value = true
  }

  return { handleAudioCanPlay, handleAudioPause }
}

export default useAudio
