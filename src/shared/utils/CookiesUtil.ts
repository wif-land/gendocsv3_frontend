'use server'

import { cookies } from 'next/headers'

/**
 * Set cookie in the browser
 * @param key - Cookie key
 * @param value - Cookie value
 */
export const setCookie = (key: string, value: unknown) => {
  cookies().set(key, value as string)
}

/**
 * Get cookie from the browser
 * @param key - Cookie key
 * @returns Cookie value
 */
export const getCookie = async (key: string) => {
  const cookieData = cookies().get(key)?.value

  if (!cookieData) return null

  return cookieData
}
