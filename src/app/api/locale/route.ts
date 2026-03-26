import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n/types'

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale')
  const redirectTo = request.nextUrl.searchParams.get('redirect') ?? '/dashboard'

  if (locale !== 'fr' && locale !== 'en') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const safe = redirectTo.startsWith('/') && !redirectTo.startsWith('//')
    ? redirectTo
    : '/dashboard'

  const res = NextResponse.redirect(new URL(safe, request.url))
  res.cookies.set(LOCALE_COOKIE, locale as Locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return res
}
