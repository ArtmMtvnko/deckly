'use client'

import {
  TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'

interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  minRows?: number
  maxRows?: number
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function AutoResizeTextarea(
    { minRows = 3, maxRows = 7, value, onChange, ...rest },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

    const resize = useCallback(() => {
      const el = innerRef.current
      if (!el) return

      const style = window.getComputedStyle(el)
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      const borderY =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
      const maxHeight = lineHeight * maxRows + paddingY + borderY

      el.style.height = 'auto'
      const contentHeight = el.scrollHeight + borderY
      el.style.height = `${Math.min(contentHeight, maxHeight)}px`
      el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
    }, [maxRows])

    useLayoutEffect(() => {
      resize()
    }, [value, resize])

    return (
      <textarea
        ref={innerRef}
        rows={minRows}
        value={value}
        onChange={onChange}
        {...rest}
      />
    )
  },
)
