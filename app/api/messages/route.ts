import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }
    
    // For development: Return mock messages
    const mockMessages = [
      {
        id: 'msg-1',
        message: 'Hello! How can I help you today?',
        sender_id: 'test_user_123',
        is_from_page: false,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        message: 'Hi! I have a question about your services.',
        sender_id: 'page_123',
        is_from_page: true,
        created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
      }
    ]
    
    return NextResponse.json(mockMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message } = await request.json()
    
    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Conversation ID and message required' }, { status: 400 })
    }
    
    // For development: Return mock message
    const mockMessage = {
      id: 'msg-new',
      message,
      sender_id: 'page_123',
      is_from_page: true,
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json(mockMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
