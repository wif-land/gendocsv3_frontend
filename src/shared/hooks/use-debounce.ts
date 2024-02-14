export const useDebounce = <F extends (...args: never[]) => unknown>(
  func: F,
  timeout: number = DEFAULT_TIMEOUT,
): F => {
  let timer: ReturnType<typeof setTimeout>

  return ((...args: never[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }) as F
}

const DEFAULT_TIMEOUT = 300
