import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'

export async function GET(request: NextRequest) {
  try {
    // Get access token and conversation ID from cookies/query params
    const cookies = request.cookies
    const accessToken = cookies.get('fb_access_token')?.value
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const pageId = searchParams.get('pageId')
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 })
    }
    
    if (!conversationId || !pageId) {
      return NextResponse.json({ error: 'Missing conversationId or pageId' }, { status: 400 })
    }
    
    console.log('Fetching messages for conversation:', conversationId, 'page:', pageId)
    
    // Create Facebook client and fetch messages
    const facebookClient = new FacebookClient(accessToken)
    const messages = await facebookClient.getMessages(pageId, conversationId)
    
    console.log('Facebook messages fetched:', messages)
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, pageId } = await request.json()
    const cookies = request.cookies
    const accessToken = cookies.get('fb_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 })
    }
    
    if (!message || !conversationId || !pageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    console.log('Sending message to conversation:', conversationId, 'page:', pageId)
    
    // Create Facebook client and send message
    const facebookClient = new FacebookClient(accessToken)
    const result = await facebookClient.sendMessage(pageId, conversationId, message)
    
    console.log('Message sent successfully:', result)
    
    return NextResponse.json({ success: true, messageId: result.message_id })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
