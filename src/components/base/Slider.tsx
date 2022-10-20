import { defineComponent, PropType, ref, unref } from 'vue'
import useSlider from '@/hooks/useSlider'
import style from './Slider.module.scss'
import { Slide } from '#/global'

interface SliderProps {
  sliders: Slide[]
}

const Slider = defineComponent({
  props: {
    sliders: {
      type: Array as PropType<SliderProps['sliders']>,
      default: () => [],
    },
  },
  name: 'Slider',
  setup(props) {
    const rootRef = ref()
    const { currentPageIndex } = useSlider(rootRef)
    return () => (
      <div class={style.slider} ref={rootRef}>
        <div class={style['slider-group']}>
          {props.sliders.map((item) => (
            <div class={style['slider-page']}>
              <a href={item.link}>
                <img src={item.pic} />
              </a>
            </div>
          ))}
        </div>
        <div class={style['dots-wrapper']}>
          {props.sliders.map((item, index) => (
            <span class={['dot', unref(currentPageIndex) === index ? 'active' : ''].join(' ')} />
          ))}
        </div>
      </div>
    )
  },
})

export default Slider
