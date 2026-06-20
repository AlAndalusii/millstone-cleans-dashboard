import { NextResponse, type NextRequest } from 'next/server'

// Edge Runtime has no Node.js crypto — just check the cookie exists here.
// Full HMAC verification runs in app/page.tsx (Node.js runtime).
const SESSION_COOKIE = 'dashboard_session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth')

  const hasSession = !!request.cookies.get(SESSION_COOKIE)?.value

  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (hasSession && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
