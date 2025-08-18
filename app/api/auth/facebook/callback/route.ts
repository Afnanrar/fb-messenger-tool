import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  
  if (!code) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app'
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`)
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.get(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`,
          code
        }
      }
    )
    
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
    const supabase = createServerClient()
    
    // Upsert user
    const { data: user } = await supabase
      .from('users')
      .upsert({
        facebook_id: userData.id,
        name: userData.name,
        email: userData.email
      })
      .select()
      .single()
    
    // Store access token in session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app'
    const response = NextResponse.redirect(`${baseUrl}/dashboard`)
    response.cookies.set('fb_access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    
    return response
  } catch (error) {
    console.error('Facebook auth error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myaimmydream.vercel.app'
    return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)
  }
}
