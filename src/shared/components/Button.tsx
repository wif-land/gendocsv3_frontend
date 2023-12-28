'use client'
import { Button } from '@nextui-org/react'

interface IProps {
  text?: string
  onclick?: () => void
  disabled?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Buttons = ({
  text = 'Aceptar',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onclick = () => {},
  disabled = true,
  color = 'bg-red-800',
  size = 'sm',
  className,
}: IProps) => {
  if (disabled) {
    return (
      <Button className={`text-white font-semibold ${color}`} size={size}>
        {text}
      </Button>
    )
  }
  return (
    <Button
      className={`text-white font-semibold ${color} ${className}`}
      onClick={onclick}
      isDisabled
      size={size}
    >
      {text}
    </Button>
  )
}
export default Buttons
