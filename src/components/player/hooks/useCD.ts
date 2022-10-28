import { Ref, ref, unref } from 'vue'

function useCD() {
  const cdImageRef = ref<HTMLImageElement>()
  const cdWrapperRef = ref<HTMLDivElement>()

  // 暂停时重置cd image包裹元素的transform
  const calcCdWrapperTransform = (
    _cdWrapperRef: Ref<HTMLDivElement | undefined>,
    _cdImageRef: Ref<HTMLImageElement | undefined>,
  ) => {
    const innerTransform = getComputedStyle(unref(_cdImageRef)!).transform
    const wrapperTRansform = getComputedStyle(unref(_cdWrapperRef)!).transform

    _cdWrapperRef.value!.style.transform =
      wrapperTRansform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTRansform)
  }

  return {
    cdImageRef,
    cdWrapperRef,
    calcCdWrapperTransform,
  }
}

export default useCD
