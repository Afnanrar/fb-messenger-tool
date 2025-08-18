import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { FacebookClient } from '@/lib/facebook/client'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get user ID from cookie
    const cookieHeader = request.headers.get('cookie')
    const cookies = cookieHeader?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    const userId = cookies?.user_id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's pages
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()
    const supabase = createServerClient()
    
    // Get user ID from cookie
    const cookieHeader = request.headers.get('cookie')
    const cookies = cookieHeader?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    const userId = cookies?.user_id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get pages from Facebook
    const fbClient = new FacebookClient(accessToken)
    const pages = await fbClient.getPages()
    
    // Store pages in database
    const pagesToInsert = pages.map((page: any) => ({
      user_id: userId,
      facebook_page_id: page.id,
      name: page.name,
      category: page.category,
      access_token: page.access_token
    }))
    
    const { data, error } = await supabase
      .from('pages')
      .upsert(pagesToInsert, { onConflict: 'facebook_page_id' })
      .select()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error syncing pages:', error)
    return NextResponse.json({ error: 'Failed to sync pages' }, { status: 500 })
  }
}
