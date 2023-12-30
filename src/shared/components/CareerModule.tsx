import { IAccountUser } from '@/features/auth/types/IUserAccount'
import { decode } from 'punycode'
import React from 'react'


const CareerModule = ({ onclick }: { onclick: () => void }) => {
    
  return (
    <div>
      <li onClick={onclick}>HOLA</li>
    </div>
  )
}

export default CareerModule
