/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react'

type Props = {
  timeout?: number
  click?: (e: React.SyntheticEvent) => void
  doubleClick: (e: React.SyntheticEvent) => void
}

const DEFAULT_TIMEOUT = 250

export const useDoubleClick = ({
  click,
  doubleClick,
  timeout = DEFAULT_TIMEOUT,
}: Props) => {
  const clickTimeout = useRef<any>()

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
    }
  }

  return useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      clearClickTimeout()
      if (click && event.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          click(event)
        }, timeout)
      }
      if (event.detail % 2 === 0) {
        doubleClick(event)
      }
    },
    [click, doubleClick, timeout],
  )
}
