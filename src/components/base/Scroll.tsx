import { defineComponent, ref } from 'vue'
import useScroll from '@/hooks/useScroll'

const Scroll = defineComponent({
  name: 'Scroll',
  setup: (props, { slots }) => {
    const rootRef = ref()
    useScroll(rootRef)
    return () => <div ref={rootRef}>{slots.default!()}</div>
  },
})

export default Scroll
