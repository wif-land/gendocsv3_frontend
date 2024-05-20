'use client'

import { useCallback, useState } from 'react'

interface ReturnType {
  value: boolean
  onTrue: () => void
  onFalse: () => void
  onToggle: () => void
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Hook to manage boolean state with helper functions
 * @param defaultValue - Default value. Can be true or false
 * @returns Object with value and helper functions
 * @example
 * const { value, onTrue, onFalse, onToggle, setValue } = useBoolean()
 * onTrue() // Set value to true
 * onFalse() // Set value to false
 * onToggle() // Toggle value
 * setValue(true) // Set value to true
 * setValue(false) // Set value to false
 * setValue((prev) => !prev) // Toggle value
 */
export const useBoolean = (defaultValue?: boolean): ReturnType => {
  const [value, setValue] = useState(!!defaultValue)

  const onTrue = useCallback(() => {
    setValue(true)
  }, [])

  const onFalse = useCallback(() => {
    setValue(false)
  }, [])

  const onToggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return {
    value,
    onTrue,
    onFalse,
    onToggle,
    setValue,
  }
}
