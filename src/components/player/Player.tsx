import { defineComponent, onMounted, Ref, ref, unref, watch } from 'vue'
import style from './Player.module.scss'
import { useCD, useLyric, useMiddleAnimation, usePlayer, useProgressBar} from './hooks';
import ProgressBar from './ProgressBar';
import { formatTime } from '@/assets/js/util';
import Scroll from '../base/Scroll';
const Player = defineComponent({
  name: 'Player',
  setup: (props, context) => {
    const audioRef= ref<HTMLAudioElement>()
    const currentSongReady = ref(false)
    const moving = ref(false)
    const {
      playing,
      fullScreen,
      currentSong,
      playerStore,
      currentTime,
      handleNextSong,
      handlePrevSong,
      handleTogglePlay,
      handleFullScreen,
      handleChangeMode,
      handleTogglerFavorite,
      handleAudioPause,
      handleAudioCanPlay,
      handleAudioTimeUpdate,
      handleAudioEnded,
      class_disabled,
      class_playIcon,
      class_modeIcon,
      class_favorite
    } = usePlayer(audioRef, currentSongReady, moving)

    const {
      handleProgressBarMoveStart,
      handleProgressBarMoving,
      handleProgressBarMoveEnd,
      handleProgressBarClick
    } = useProgressBar(audioRef, moving, currentTime)

    const {
      cdImageRef,
      cdWrapperRef,
      calcCdWrapperTransform
    } = useCD()

    const {
      currentLyric,
      currentLine,
      lyricListRef,
      lyricScrollRef,
    } = useLyric(currentTime)

    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleAnimation()

    // 监听当前歌曲变化->自动播放
    watch(currentSong, async (val) => {
      currentSongReady.value = false
      const song = unref(currentSong)
      const audio = unref(audioRef)!
      if(!val.id || !val.url) return
      audio.src = song.url
      await audio.play()
      playerStore.setPlayingState(true)
    })
    // 监听播放状态->控制audio
    watch(playing, (val) => {
      const audio = unref(audioRef)
      if(val) audio!.play()
      else {
        audio!.pause()
        calcCdWrapperTransform(cdWrapperRef, cdImageRef)
      }
    })


    return () => (
      <div class={style.player}>
        {unref(fullScreen) && (
          <>
            <div class={style['normal-player']}>
              {/* 最小化按钮 */}
              <div class={style.background}>
                <img src={unref(currentSong).pic} />
              </div>

              {/* 顶部: 歌词+歌手 */}
              <div class={style.top}>
                <div class={style.back} onClick={handleFullScreen}>
                  <i class={['icon-back', style['player-icon-back']].join(' ')} />
                </div>
                <h1 class={style.title}>{unref(currentSong).name}</h1>
                <h2 class={style.subtitle}>{unref(currentSong).singer}</h2>
              </div>

              {/* 中部: cd旋转图片+歌词 */}
              <div
                class={style.middle}
                onTouchstart={onMiddleTouchStart}
                onTouchmove={onMiddleTouchMove}
                onTouchend={onMiddleTouchEnd}
              >
                {/* cd旋转图片 */}
                <div
                  class={style['middle-l']}
                  style={unref(middleLStyle)}
                >
                  <div class={style['cd-wrapper']} ref={cdWrapperRef}>
                    <div class={style.cd}>
                      <img
                        ref={cdImageRef}
                        src={unref(currentSong).pic}
                        class={[unref(playing) ? style.playing : '']}
                      />
                    </div>
                  </div>
                </div>
                {/* 歌词 */}
                <Scroll
                  ref={lyricScrollRef}
                  class={style['middle-r']}
                  style={unref(middleRStyle)}
                >
                  <div class={style['lyric-wrapper']}>
                    {unref(currentLyric) && (
                      <div ref={lyricListRef}>
                        {
                          unref(currentLyric).map((line) => (
                            <p class={[style.text, line.line === unref(currentLine)? style.current : ''].join(' ')}>{line.txt || ' '}</p>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </Scroll>
              </div>

              {/* 底部: 进度条+操作按钮组 */}
              <div class={style.bottom}>
                <div class={style['dot-wrapper']}>
                  <span class={[style.dot, unref(currentShow) === 'cd' ? style.active : '']} />
                  <span class={[style.dot, unref(currentShow) === 'lyric' ? style.active : '']} />
                </div>
                {/* 进度条 */}
                <div class={style['progress-wrapper']}>
                  <span class={[style.time, style['time-l']]}>
                    {formatTime(unref(currentTime))}
                  </span>
                  <div class={style['progress-bar-wrapper']}>
                    <ProgressBar
                      onTouchStart={handleProgressBarMoveStart}
                      onTouchMove={handleProgressBarMoving}
                      onTouchEnd={handleProgressBarMoveEnd}
                      onClick={handleProgressBarClick}
                      progress={unref(currentTime) / unref(currentSong).duration}
                    />
                  </div>
                  <span class={[style.time, style['time-r']]}>
                    {formatTime(unref(currentSong).duration)}
                  </span>
                </div>
                {/* 操作按钮组 */}
                <div class={style.operators}>
                  <div class={[style.icon, style['i-left']]}>
                    <i class={unref(class_modeIcon)} onClick={handleChangeMode} />
                  </div>
                  <div class={[style.icon, style['i-left'], style[unref(class_disabled)]]}>
                    <i class="icon-prev" onClick={handlePrevSong} />
                  </div>

                  <div class={[style.icon, style['i-center'], unref(class_disabled)]}>
                    <i class={unref(class_playIcon)} onClick={handleTogglePlay} />
                  </div>

                  <div class={[style.icon, style['i-right'], unref(class_disabled)]}>
                    <i class="icon-next" onClick={handleNextSong} />
                  </div>
                  <div class={[style.icon, style['i-right']]}>
                    <i
                      class={class_favorite(unref(currentSong))}
                      onClick={() => handleTogglerFavorite(unref(currentSong))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <audio
          ref={audioRef}
          onPause={handleAudioPause}
          onCanplay={handleAudioCanPlay}
          onTimeupdate={handleAudioTimeUpdate}
          onEnded={handleAudioEnded}
        />
      </div>
    )
  },
})
export default Player
