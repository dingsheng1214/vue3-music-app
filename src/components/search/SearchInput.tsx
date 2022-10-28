import { defineComponent, PropType, ref, unref, watch } from 'vue'
import style from './SearchInput.module.scss'

const SearchInput = defineComponent({
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String as PropType<string>,
      default: '',
    },
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const queryString = ref(props.modelValue)
    const inputRef = ref<HTMLInputElement>()
    const onChange = () => {
      if (unref(inputRef)) {
        queryString.value = unref(inputRef)?.value!
      }
    }
    const clear = () => {
      queryString.value = ''
    }
    watch(queryString, () => {
      emit('update:modelValue', queryString.value)
    })
    return () => (
      <div class={style['search-input']}>
        <i class={['icon-search', style['icon-search']]} />
        <input
          ref={inputRef}
          class={style['input-inner']}
          placeholder={props.placeholder}
          value={unref(queryString)}
          onInput={onChange}
        />
        {queryString.value ? (
          <i class={['icon-dismiss', style['icon-dismiss']]} onClick={clear} />
        ) : null}
      </div>
    )
  },
})
export default SearchInput
