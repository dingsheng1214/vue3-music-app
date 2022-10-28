import { Ref, unref } from 'vue'
import { usePlayerStore } from '@/store'

function useProgressBar(
  audioRef: Ref<HTMLAudioElement | undefined>,
  moving: Ref<boolean>,
  currentTime: Ref<number>,
) {
  const playerStore = usePlayerStore()
  const handleProgressBarMoveStart = () => {
    moving.value = true
  }
  const handleProgressBarMoving = (progress: number) => {
    currentTime.value = playerStore.currentSong.duration * progress
  }
  const handleProgressBarMoveEnd = () => {
    moving.value = false
    unref(audioRef)!.currentTime! = unref(currentTime)
  }
  const handleProgressBarClick = (progress: number) => {
    currentTime.value = playerStore.currentSong.duration * progress
    moving.value = true
    unref(audioRef)!.currentTime! = unref(currentTime)
    moving.value = false
  }
  return {
    handleProgressBarMoveStart,
    handleProgressBarMoving,
    handleProgressBarMoveEnd,
    handleProgressBarClick,
  }
}
export default useProgressBar
