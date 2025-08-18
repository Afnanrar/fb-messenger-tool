import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookies = request.cookies
  const allCookies: Record<string, string> = {}
  
  cookies.getAll().forEach(cookie => {
    allCookies[cookie.name] = cookie.value
  })
  
  return NextResponse.json({
    message: 'Current cookies',
    cookies: allCookies,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
    }
  })
}
