import { FormEvent } from "react"
import { Button } from "../Button/Button"

import './styles.module.scss'

interface FormNewRoomProps {
  onSubmit: (event: FormEvent) => void;
  onChange: (targetValue: string) => void;
  inputValue: string;
  inputPlaceholder: string;
  btnText: string;
  className?: string;
}

export const FormNewRoom = ({
  onSubmit,
  onChange,
  inputValue,
  inputPlaceholder,
  btnText,
  className
}:FormNewRoomProps ) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <input 
        type="text" 
        placeholder={inputPlaceholder}
        onChange={event => onChange(event.target.value)} 
        value={inputValue} 
      />
      <Button type="submit">{btnText}</Button>
    </form>
  )
}