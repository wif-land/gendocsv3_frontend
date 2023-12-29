'use server'
import { cookies } from 'next/headers'

export const setCookie = (
  key: string,
  value: unknown,
  expire?: number | undefined,
) => {
  const DAY = 24
  const HOUR = 60
  const MINUTE = 60
  const SECOND = 1000

  if (expire) {
    cookies().set(key, JSON.stringify(value), {
      expires: expire * DAY * HOUR * MINUTE * SECOND,
    })
  } else {
    cookies().set(key, JSON.stringify(value))
  }
}

export const getCookie = async (key: string) => {
  const cookie = cookies().get(key)
  if (!cookie) return null
  return await JSON.parse(cookie.value)
}

export const removeCookie = (key: string) => {
  cookies().delete(key)
}
