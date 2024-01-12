'use client'
import { Button } from '@nextui-org/react'

interface IProps {
  label: string
  disabled?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onclick?: () => void
}

export const ButtonComponent = ({
  label = 'Aceptar',
  disabled = true,
  color = 'bg-red-800',
  size = 'sm',
  className,
  onclick,
}: IProps) => {
  if (disabled) {
    return (
      <Button className={`text-white font-semibold ${color}`} size={size}>
        {label}
      </Button>
    )
  }

  return (
    <Button
      onPress={onclick}
      radius="sm"
      className={`w-40 h-12 ml-6 border-2  bg-red-600 text-white ${className}`}
    >
      {label}
    </Button>
  )
}
