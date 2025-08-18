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
    
    console.log('Raw Facebook conversations response:', JSON.stringify(conversations, null, 2))
    
    // Transform the data to match our expected format
    const transformedConversations = conversations.map((conv: any) => {
      console.log('Processing conversation:', conv)
      
      // Extract participant info - Facebook might have different field names
      const participant = conv.participants?.data?.[0] || conv.participants?.[0] || conv.from || conv.sender || {}
      const participantId = participant.id || participant.user_id || conv.id || 'unknown'
      const participantName = participant.name || participant.first_name || participantId
      
      // Extract message info
      const message = conv.messages?.data?.[0] || conv.messages?.[0] || conv.message || {}
      const messageText = message.message || message.text || conv.last_message || 'No message'
      const messageTime = message.created_time || message.timestamp || conv.updated_time || conv.created_time || new Date().toISOString()
      
      // Extract page info
      const pageName = conv.page?.name || conv.page_name || 'Unknown Page'
      
      return {
        id: conv.id || conv.conversation_id || `conv_${Date.now()}`,
        participant_id: participantName,
        last_message: messageText,
        last_message_time: messageTime,
        unread_count: conv.unread_count || 0,
        pages: {
          name: pageName
        },
        // Store raw data for debugging
        _raw: conv
      }
    })
    
    console.log('Transformed conversations:', JSON.stringify(transformedConversations, null, 2))
    
    return NextResponse.json(transformedConversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
