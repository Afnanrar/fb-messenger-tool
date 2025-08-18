import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Log cookies using getAll() method
  const allCookies = request.cookies.getAll()
  console.log('Cookies in middleware:', allCookies.map(cookie => ({ name: cookie.name, value: cookie.value })))
  
  // Check if user is authenticated for protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const fbAccessToken = request.cookies.get('fb_access_token')
    const userId = request.cookies.get('fb_user_id')
    
    console.log('Dashboard access check:')
    console.log('- fb_access_token exists:', !!fbAccessToken)
    console.log('- fb_user_id exists:', !!userId)
    
    if (!fbAccessToken || !userId) {
      console.log('Redirecting to login - missing cookies')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    console.log('Dashboard access granted')
  }
  
  // Check if authenticated user tries to access login
  if (request.nextUrl.pathname === '/login') {
    const fbAccessToken = request.cookies.get('fb_access_token')
    const userId = request.cookies.get('fb_user_id')
    
    if (fbAccessToken && userId) {
      console.log('Redirecting authenticated user to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}
