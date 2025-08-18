import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is authenticated for protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const fbAccessToken = request.cookies.get('fb_access_token')
    const userId = request.cookies.get('user_id')
    
    if (!fbAccessToken || !userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Check if authenticated user tries to access login
  if (request.nextUrl.pathname === '/login') {
    const fbAccessToken = request.cookies.get('fb_access_token')
    const userId = request.cookies.get('user_id')
    
    if (fbAccessToken && userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}
