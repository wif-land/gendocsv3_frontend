import { useEffect, useState } from 'react'

export const useDebounce = (value: string, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || DEFAULT_DELAY)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const DEFAULT_DELAY = 300
