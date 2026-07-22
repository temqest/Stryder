import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-site routing.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect the dashboard and runner routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isRunnerRoute = request.nextUrl.pathname.startsWith('/runner')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

  if (
    !user &&
    (isDashboardRoute || isRunnerRoute)
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, you could potentially check their role and redirect
  // them away from auth pages to their respective portal.
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    // Redirect to the dispatcher to determine role and forward accordingly
    url.pathname = '/auth/dispatcher'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
