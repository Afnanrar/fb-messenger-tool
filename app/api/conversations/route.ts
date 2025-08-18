import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For development: Return mock conversations
    const mockConversations = [
      {
        id: 'conv-1',
        participant_id: 'user_123',
        last_message: 'Hello! How can I help you today?',
        last_message_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        unread_count: 1,
        pages: {
          name: 'Test Facebook Page'
        }
      },
      {
        id: 'conv-2',
        participant_id: 'user_456',
        last_message: 'I have a question about pricing.',
        last_message_time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        unread_count: 0,
        pages: {
          name: 'Test Facebook Page'
        }
      }
    ]
    
    return NextResponse.json(mockConversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
