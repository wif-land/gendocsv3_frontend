'use server'
import { cookies } from 'next/headers'

export const setCookie = (
  key: string,
  value: unknown,
  expire?: number | undefined,
) => {
  if (expire) {
    cookies().set(key, JSON.stringify(value), {
      // eslint-disable-next-line no-magic-numbers
      expires: expire * 24 * 60 * 60 * 1000,
    })
  } else {
    cookies().set(key, JSON.stringify(value))
  }
}

export const getCookie = async (key: string) => {
  const cookie = cookies().get(key)
  if (!cookie) {
    return null
  } else {
    return await JSON.parse(cookie.value)
  }
}

export const removeCookie = (key: string) => {
  cookies().delete(key)
}
