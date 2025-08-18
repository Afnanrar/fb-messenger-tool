import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app').replace(/\/$/, '')
  const redirectUri = `${baseUrl}/api/auth/callback/facebook`
  const scope = 'pages_show_list,pages_read_engagement,pages_messaging'
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`
  
  return NextResponse.redirect(authUrl)
}
