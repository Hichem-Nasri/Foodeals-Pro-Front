import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

const locales = ['en', 'fr', 'ar']
const defaultLocale = 'en'

// Get the preferred locale, prioritizing referrer and cookies
function getLocale(
  request: NextRequest
): string {
  // First, check if there's a locale in the referrer URL
  const referer =
    request.headers.get('referer')
  if (referer) {
    try {
      const refererUrl = new URL(
        referer
      )
      const refererPathname =
        refererUrl.pathname
      const localeInReferer =
        locales.find(
          (locale) =>
            refererPathname.startsWith(
              `/${locale}/`
            ) ||
            refererPathname ===
              `/${locale}`
        )
      if (localeInReferer) {
        return localeInReferer
      }
    } catch (e) {
      // Invalid referer URL, continue
    }
  }

  // Check for locale preference in cookies
  const localeCookie =
    request.cookies.get('NEXT_LOCALE')
  if (
    localeCookie &&
    locales.includes(localeCookie.value)
  ) {
    return localeCookie.value
  }

  // Check Accept-Language header as fallback
  const acceptLanguage =
    request.headers.get(
      'accept-language'
    )
  if (acceptLanguage) {
    const preferredLocale =
      acceptLanguage
        .split(',')
        .map((lang) =>
          lang.split(';')[0].trim()
        )
        .find((lang) => {
          const shortLang =
            lang.split('-')[0]
          return locales.includes(
            shortLang
          )
        })

    if (preferredLocale) {
      const shortLang =
        preferredLocale.split('-')[0]
      if (locales.includes(shortLang)) {
        return shortLang
      }
    }
  }

  return defaultLocale
}
export async function middleware(
  request: NextRequest
) {
  // Get session to check authentication status
  const session = await auth()

  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale =
    locales.some(
      (locale) =>
        pathname.startsWith(
          `/${locale}/`
        ) || pathname === `/${locale}`
    )

  // Extract the path without locale for route checking
  let pathWithoutLocale = pathname
  if (pathnameHasLocale) {
    const currentLocale = locales.find(
      (locale) =>
        pathname.startsWith(
          `/${locale}/`
        ) || pathname === `/${locale}`
    )
    if (currentLocale) {
      pathWithoutLocale =
        pathname.replace(
          `/${currentLocale}`,
          ''
        ) || '/'
    }
  }

  // Define public routes (only auth pages are public)
  const isAuthPage =
    pathWithoutLocale.startsWith(
      '/auth/signin'
    )

  // Handle root path special case
  const isRootPath =
    pathWithoutLocale === '/'

  // Everything else is protected by default
  const isProtectedRoute =
    !isAuthPage && !isRootPath

  // Handle authentication logic
  if (!session && isProtectedRoute) {
    // Redirect unauthenticated users to login
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/signin`
    return NextResponse.redirect(url)
  }

  if (!session && isRootPath) {
    // Redirect unauthenticated users from root to login
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/auth/signin`
    return NextResponse.redirect(url)
  }

  if (session && isAuthPage) {
    // Redirect authenticated users away from auth pages to dashboard
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  // If pathname already has a valid locale, set cookie and continue
  if (pathnameHasLocale) {
    const currentLocale = locales.find(
      (locale) =>
        pathname.startsWith(
          `/${locale}/`
        ) || pathname === `/${locale}`
    )

    if (currentLocale) {
      // Set locale cookie for future navigation
      const response =
        NextResponse.next()
      response.cookies.set(
        'NEXT_LOCALE',
        currentLocale,
        {
          maxAge: 60 * 60 * 24 * 365, // 1 year
          path: '/',
        }
      )
      return response
    }
    return NextResponse.next()
  }

  // For paths without locale, get preferred locale and redirect
  const locale = getLocale(request)
  console.log('locale:', locale)

  // Create new URL with locale prefix
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  // Create redirect response and set the locale cookie
  const response =
    NextResponse.redirect(url)
  response.cookies.set(
    'NEXT_LOCALE',
    locale,
    {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    }
  )

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|_vercel|api|favicon.ico|icons|images|fonts|.*\\..*).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
