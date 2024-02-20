'use server'

import { cookies } from 'next/headers'

export const setCookie = (key: string, value: unknown) => {
  const DAY = 24
  const HOUR = 60
  const MINUTE = 60
  const SECOND = 1000

  cookies().set(key, value as string),
    {
      path: '/',
      maxAge: DAY * HOUR * MINUTE * SECOND,
    }
}

export const getCookie = (key: string) => {
  const cookieData = cookies().get(key)?.value

  if (!cookieData) return null

  return cookieData
}
