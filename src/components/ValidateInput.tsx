"use client"
import {Input} from "@nextui-org/react";
import { useState, useMemo } from "react";

interface IProps {
    type: string;
    label: string;
    variant?: 'bordered'|'flat'|'underlined'|'faded';
    placeholder: string;
    errorMessage?: string;
    regex?: string;	
}

const Inputs = ({type,label,variant,placeholder,errorMessage,regex}:IProps) => {
    const [value, setValue] = useState<string>("");
    const validateEmail = (email: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    const isInvalid = useMemo(() => {
        if (value === "") return false;
    
        return validateEmail(value) ? false : true;
      }, [value]);
  return (

      <Input
      type={type}
      label={label}
      variant={variant}
      placeholder={placeholder}
      color={isInvalid ? "danger" : "success"}
      errorMessage={isInvalid && `${errorMessage}`}
      onValueChange={setValue}
      className="max-w-xs"
    />
  )
}

export default Inputs
