import { NextResponse, type NextRequest } from 'next/server'
import { cookieToJson, getCookie } from './shared/utils/CookiesUtil'
import { appPublicRoutes } from './shared/constants/appPublicRoutes'

export let COOKIES: unknown = {}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export const middleware = async (request: NextRequest) => {
  const headerCookies = request.cookies

  COOKIES = cookieToJson(JSON.stringify(headerCookies.getAll()))

  const hasAccessToken = getCookie('access_token') !== null

  const isLoginPage = request.nextUrl.pathname.startsWith(appPublicRoutes.login)
  const isRootPage = request.nextUrl.pathname === '/'

  if (!hasAccessToken && !isLoginPage) {
    return NextResponse.redirect(new URL(appPublicRoutes.login, request.url))
  }

  if (hasAccessToken && isLoginPage) {
    return NextResponse.redirect(new URL('dashboard', request.url))
  }

  if (hasAccessToken && isRootPage) {
    return NextResponse.redirect(new URL('dashboard', request.url))
  }

  return NextResponse.next()
}
