import { computed, defineComponent, PropType, unref } from 'vue'
import style from './ProgressCircle.module.scss'

const ProgressCircle = defineComponent({
  name: 'ProgressCircle',
  props: {
    radius: {
      type: Number as PropType<number>,
      default: 100,
    },
    progress: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup: (props, { slots }) => {
    const dashArray = Math.PI * 100
    const dashOffset = computed(() => (1 - props.progress) * dashArray)
    return () => (
      <div class={style['progress-circle']}>
        <svg
          width={props.radius}
          height={props.radius}
          viewBox="0 0 100 100"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle class={style['progress-background']} r="50" cx="50" cy="50" fill="transparent" />
          <circle
            class={style['progress-bar']}
            r="50"
            cx="50"
            cy="50"
            fill="transparent"
            stroke-dasharray={dashArray}
            stroke-dashoffset={unref(dashOffset)}
          />
        </svg>
        {slots.default?.()}
      </div>
    )
  },
})
export default ProgressCircle
