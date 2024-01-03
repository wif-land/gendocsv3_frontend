'use server'

import { cookies } from 'next/headers'

export const setCookie = (key: string, value: unknown) => {
  const DAY = 24
  const HOUR = 60
  const MINUTE = 60
  const SECOND = 1000

  cookies().set(key, JSON.stringify(value), {
    expires: DAY * HOUR * MINUTE * SECOND,
  })
}

export const getCookie = (key: string) => {
  const cookieData = cookies().get(key)?.value

  if (!cookieData) return null

  return cookieData
}

export const cookieToJson = (cookie: string) => {
  const parsedCookies: {
    [key: string]: string
  } = {}

  JSON.parse(cookie).forEach((cookie: { name: string; value: string }) => {
    const { name, value } = cookie

    try {
      parsedCookies[name] = JSON.parse(value)
    } catch (error) {
      parsedCookies[name] = value
    }
  })

  return parsedCookies
}
