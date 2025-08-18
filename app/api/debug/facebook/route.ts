import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    facebook_app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    facebook_app_secret: process.env.FACEBOOK_APP_SECRET ? '***SET***' : '***NOT SET***',
    webhook_verify_token: process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN ? '***SET***' : '***NOT SET***',
    page_access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN ? '***SET***' : '***NOT SET***',
    app_url: process.env.NEXT_PUBLIC_APP_URL,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/facebook`,
    oauth_url: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(`${process.env.NUBLIC_APP_URL}/api/auth/callback/facebook`)}&scope=pages_show_list,pages_read_engagement,pages_messaging&response_type=code`
  }
  
  return NextResponse.json({
    message: 'Facebook App Configuration Debug Info',
    config,
    timestamp: new Date().toISOString()
  })
}
