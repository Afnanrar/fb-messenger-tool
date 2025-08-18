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
    
    console.log('Facebook pages fetched:', pages)
    
    return NextResponse.json(pages)
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
    
    console.log('Facebook pages synced:', pages)
    
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error syncing pages:', error)
    return NextResponse.json({ error: 'Failed to sync pages' }, { status: 500 })
  }
}
