import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getSafeRedirectPath } from '@/lib/auth/redirect'

const protectedPathPrefixes = ['/dashboard', '/sessions', '/settings']
const authPathPrefixes = ['/auth/sign-in', '/auth/sign-up']

function hasPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function isProtectedPath(pathname: string) {
  return protectedPathPrefixes.some((prefix) => hasPathPrefix(pathname, prefix))
}

function isAuthPath(pathname: string) {
  return authPathPrefixes.some((prefix) => hasPathPrefix(pathname, prefix))
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  let pendingCookies: Parameters<typeof response.cookies.set>[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          pendingCookies = cookiesToSet.map(({ name, value, options }) => [
            name,
            value,
            options,
          ])

          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({ request })

          pendingCookies.forEach((cookie) => {
            response.cookies.set(...cookie)
          })
        },
      },
    },
  )

  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims

  const isAuthenticated = Boolean(claims && !error)
  const { pathname, search } = request.nextUrl

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    redirectUrl.search = ''
    redirectUrl.searchParams.set('next', getSafeRedirectPath(`${pathname}${search}`))

    const redirectResponse = NextResponse.redirect(redirectUrl)
    pendingCookies.forEach((cookie) => {
      redirectResponse.cookies.set(...cookie)
    })

    return redirectResponse
  }

  if (isAuthPath(pathname) && isAuthenticated) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = getSafeRedirectPath(request.nextUrl.searchParams.get('next'))
    redirectUrl.search = ''

    const redirectResponse = NextResponse.redirect(redirectUrl)
    pendingCookies.forEach((cookie) => {
      redirectResponse.cookies.set(...cookie)
    })

    return redirectResponse
  }

  return response
}
