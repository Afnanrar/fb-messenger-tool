import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'

export async function GET(request: NextRequest) {
  try {
    // Get access token and page ID from cookies/query params
    const cookies = request.cookies
    const accessToken = cookies.get('fb_access_token')?.value
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    
    console.log('Conversations API called with:')
    console.log('- Access token exists:', !!accessToken)
    console.log('- Page ID:', pageId)
    
    // Log cookies using getAll() method
    const allCookies = cookies.getAll()
    console.log('- All cookies:', allCookies.map(cookie => ({ name: cookie.name, value: cookie.value })))
    
    if (!accessToken) {
      console.error('No access token found in cookies')
      return NextResponse.json({ 
        error: 'No access token found',
        cookies: allCookies.map(cookie => ({ name: cookie.name, value: cookie.value }))
      }, { status: 401 })
    }
    
    if (!pageId) {
      console.error('No page ID provided')
      return NextResponse.json({ error: 'No page ID provided' }, { status: 400 })
    }
    
    console.log('Fetching conversations for page:', pageId)
    
    // Create Facebook client and fetch conversations
    const facebookClient = new FacebookClient(accessToken)
    const conversations = await facebookClient.getConversations(pageId)
    
    console.log('Facebook conversations fetched:', conversations)
    
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
