import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const accessToken = cookies().get('fb_access_token')?.value
    const pageId = request.nextUrl.searchParams.get('pageId')
    
    console.log('Fetching conversations API called.')
    console.log('- Access token exists:', !!accessToken)
    console.log('- Page ID:', pageId)
    
    if (!accessToken) {
      console.error('No access token found in cookies')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    if (!pageId) {
      console.error('No pageId provided for conversations API')
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }
    
    console.log('Fetching conversations for page:', pageId)
    
    const facebookClient = new FacebookClient(accessToken)
    
    // Get page access token first
    const pages = await facebookClient.getPages()
    const page = pages.find((p: any) => p.id === pageId)
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    const conversations = await facebookClient.getConversations(pageId, page.access_token)
    
    // Transform Facebook API response to match our Conversation interface
    const transformedConversations = conversations.map((conv: any) => {
      const participant = conv.participants?.data?.find((p: any) => p.id !== pageId)
      const lastMessage = conv.messages?.data?.[0]
      
      return {
        id: conv.id,
        participant_id: participant?.name || participant?.id || 'Unknown User',
        last_message: lastMessage?.message || 'No message',
        last_message_time: lastMessage?.created_time || conv.updated_time,
        unread_count: 0, // Facebook API doesn't directly provide unread count easily
        pages: {
          name: conv.page?.name || 'Unknown Page' // Assuming page name is available here
        }
      }
    })
    
    console.log('Facebook conversations fetched and transformed:', transformedConversations)
    return NextResponse.json(transformedConversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversations'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
