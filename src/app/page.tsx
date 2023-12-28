'use client'

import { LoginForm } from '../features/auth/components/LoginForm'

// import { Input } from '@nextui-org/react'
// import Button from '../shared/components/Button'
// import { useEffect, useState } from 'react'
// import { create, StateCreator } from 'zustand'
// import { persist } from 'zustand/middleware'

// interface StoreState {
//   user: IUser | undefined
//   setUser: (user: IUser) => void
//   logout: () => void
// }

// export const useUserStore = create<StoreState>(
//   persist(
//     (set) => ({
//       user: undefined,
//       setUser: (user: IUser) => set({ user }),
//       logout: () => set({ user: undefined }),
//     }),
//     {
//       name: 'user',
//     },
//   ) as StateCreator<StoreState>,
// )

export interface IUser {
  id: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  email: string
  phoneNumber: string
  address: string
  user: string
  password: string
  role: string
}

// export const fetchLogin = async (username: string, password: string) => {
//   try {
//     const response = await fetch(
//       `https://restaurant-orders-manager-back-api.onrender.com/auth/login`,
//       {
//         method: 'POST',
//         headers: {
//           // eslint-disable-next-line @typescript-eslint/naming-convention
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user: username,
//           password,
//         }),
//       },
//     )

//     if (!response.ok) {
//       console.log('Error en la autenticación.')
//       return
//     }
//     const data = await response.json()
//     const userData: IUser = data

//     if (!userData) {
//       console.log('Error en la autenticación')
//       return
//     }

//     return userData
//   } catch (error) {
//     console.log(error)
//   }
// }

// eslint-disable-next-line no-extra-parens
const Home = () => <LoginForm />

export default Home
