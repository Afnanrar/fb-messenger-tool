import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  
  if (!code) {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app').replace(/\/$/, '')
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`)
  }
  
  try {
    console.log('Facebook OAuth callback received with code:', code)
    
    // Exchange code for access token
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app').replace(/\/$/, '')
    const redirectUri = `${baseUrl}/api/auth/callback/facebook`
    
    const tokenResponse = await axios.get(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: redirectUri,
          code
        }
      }
    )
    
    console.log('Token response received:', tokenResponse.data)
    const { access_token } = tokenResponse.data
    
    // Get user info
    const userResponse = await axios.get(
      'https://graph.facebook.com/v18.0/me',
      {
        params: {
          access_token,
          fields: 'id,name,email'
        }
      }
    )
    
    const userData = userResponse.data
    console.log('User data received:', userData)
    
    // Check if we're in development mode
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      console.log('Development mode: Setting mock cookies')
      
      // Set cookies for development mode
      const response = NextResponse.redirect(`${baseUrl}/dashboard`)
      response.cookies.set('fb_user_id', userData.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      response.cookies.set('fb_access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      return response
    }
    
    // TODO: In production, save user to Supabase and set proper session
    console.log('Production mode: Would save user to Supabase')
    
    // For now, redirect to dashboard with cookies
    const response = NextResponse.redirect(`${baseUrl}/dashboard`)
    response.cookies.set('fb_user_id', userData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    response.cookies.set('fb_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Facebook auth error:', error)
    
    // Log detailed error information
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Error response:', (error as any).response.data)
      console.error('Error status:', (error as any).response.status)
      console.error('Error headers:', (error as any).response.headers)
    }
    
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app').replace(/\/$/, '')
    return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)
  }
}
