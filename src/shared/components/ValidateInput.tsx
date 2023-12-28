'use client'
import { Input } from '@nextui-org/react'
import { useState, useMemo } from 'react'

interface IProps {
  type: string
  label: string
  variant?: 'bordered' | 'flat' | 'underlined' | 'faded'
  placeholder: string
  errorMessage?: string
  regex?: RegExp
}

const Inputs = ({
  type,
  label,
  variant,
  placeholder,
  errorMessage,
  regex,
}: IProps) => {
  const [value, setValue] = useState<string>('')

  const validateString = () => {
    if (regex === undefined) return true
    return value.match(regex || '')
  }

  const isInvalid = useMemo(() => {
    if (value === '') return false

    return !validateString()
  }, [value])

  return (
    <Input
      type={type}
      label={label}
      variant={variant}
      placeholder={placeholder}
      color={isInvalid ? 'danger' : 'success'}
      errorMessage={isInvalid && `${errorMessage}`}
      onValueChange={setValue}
      className="max-w-xs"
    />
  )
}

export default Inputs
