'use client'
import Cookies from 'js-cookie'
import { COOKIES } from '../../middleware'

export const setCookie = (key: string, value: unknown) => {
  const DAY = 24
  const HOUR = 60
  const MINUTE = 60
  const SECOND = 1000

  Cookies.set(key, JSON.stringify(value), {
    expires: DAY * HOUR * MINUTE * SECOND,
  })
}

export const getCookie = (key: string) => {
  const cookieData = COOKIES && COOKIES[key as keyof typeof COOKIES]

  if (!cookieData) return null

  return cookieData && decodeURIComponent(cookieData as string)
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
