import { defineComponent, PropType, ref } from 'vue'
import useScroll from '@/hooks/useScroll'

const Scroll = defineComponent({
  name: 'Scroll',
  props: {
    options: {
      type: Object as PropType<Record<string, any>>,
      default: () => {}
    }
  },
  emits: ['scroll'],
  setup: (props, { slots, emit, expose }) => {
    const rootRef = ref()
    const scroll = useScroll(rootRef, props.options, (pos: {x: number, y: number}) => {
      emit('scroll', pos)
    })
    function scrollTo(el: HTMLElement, time = 1, offsetX = 0, offsetY = 0) {
      scroll.value?.scrollToElement(el, time, offsetX, offsetY)
    }
    expose({scrollTo: scrollTo})
    return () => <div ref={rootRef}>{slots.default!()}</div>
  },
})

export default Scroll
