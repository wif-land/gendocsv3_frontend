"use client";
import {Button} from '@nextui-org/react'

interface IProps {
  text?: string;
  onclick?: () => void;
  disabled?: boolean;
  color?: string;
  size?: "sm"|"md"| "lg";
}

const Buttons =({text = 'Aceptar',onclick = ()=> {}, disabled = true,color = 'bg-red-800', size = 'sm'}:IProps)=> {
  if (disabled) {
    return (
      <Button className={`text-white font-semibold ${color}`} size={size} >{text}</Button>
    )
  }
  return (
      <Button className={`text-white font-semibold ${color}`} onClick={onclick} isDisabled size={size}>{text}</Button>
  )
}
export default Buttons;

