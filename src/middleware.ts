import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_COOKIE_NAME } from './shared/constants/appApiRoutes'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/',
    '/login',
    '/dashboard/:slug',
  ],
}

export const middleware = async (request: NextRequest) => {
  const hasAccessToken = !!request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isPublicPage = request.nextUrl.pathname.startsWith('/auth')
  const isRootPage = request.nextUrl.pathname === '/'

  if (!hasAccessToken && !isLoginPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasAccessToken && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (hasAccessToken && isRootPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
