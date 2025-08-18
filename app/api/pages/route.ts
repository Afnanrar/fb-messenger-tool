import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const cookies = request.cookies
    const accessToken = cookies.get('fb_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 })
    }
    
    console.log('Fetching Facebook pages with access token...')
    
    // Create Facebook client and fetch pages
    const facebookClient = new FacebookClient(accessToken)
    const pages = await facebookClient.getPages()
    
    console.log('Raw Facebook pages response:', JSON.stringify(pages, null, 2))
    
    // Transform the data to match our expected format
    const transformedPages = pages.map((page: any) => {
      console.log('Processing page:', page)
      
      return {
        id: page.id || page.page_id || `page_${Date.now()}`,
        name: page.name || page.page_name || 'Unknown Page',
        category: page.category || page.page_category || 'Business',
        facebook_page_id: page.id || page.page_id || page.id,
        access_token: page.access_token || 'no_token',
        // Store raw data for debugging
        _raw: page
      }
    })
    
    console.log('Transformed pages:', JSON.stringify(transformedPages, null, 2))
    
    return NextResponse.json(transformedPages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 400 })
    }
    
    console.log('Syncing Facebook pages with access token...')
    
    // Create Facebook client and sync pages
    const facebookClient = new FacebookClient(accessToken)
    const pages = await facebookClient.getPages()
    
    console.log('Raw Facebook pages response:', JSON.stringify(pages, null, 2))
    
    // Transform the data to match our expected format
    const transformedPages = pages.map((page: any) => {
      console.log('Processing page:', page)
      
      return {
        id: page.id || page.page_id || `page_${Date.now()}`,
        name: page.name || page.page_name || 'Unknown Page',
        category: page.category || page.page_category || 'Business',
        facebook_page_id: page.id || page.page_id || page.id,
        access_token: page.access_token || 'no_token',
        // Store raw data for debugging
        _raw: page
      }
    })
    
    console.log('Transformed pages:', JSON.stringify(transformedPages, null, 2))
    
    return NextResponse.json(transformedPages)
  } catch (error) {
    console.error('Error syncing pages:', error)
    return NextResponse.json({ error: 'Failed to sync pages' }, { status: 500 })
  }
}
