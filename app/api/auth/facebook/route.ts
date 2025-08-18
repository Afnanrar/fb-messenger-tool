import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/facebook`
  const scope = 'pages_show_list,pages_read_engagement,pages_messaging'
  
  console.log('Facebook OAuth initiated with:')
  console.log('Client ID:', clientId)
  console.log('Redirect URI:', redirectUri)
  console.log('Scope:', scope)
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`
  
  console.log('Redirecting to Facebook OAuth URL')
  return NextResponse.redirect(authUrl)
}
