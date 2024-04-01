'use server'

import { cookies } from 'next/headers'

export const setCookie = (key: string, value: unknown) => {
  cookies().set(key, value as string)
}

export const getCookie = async (key: string) => {
  const cookieData = cookies().get(key)?.value

  if (!cookieData) return null

  return cookieData
}
