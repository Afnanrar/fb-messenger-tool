import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { FacebookClient } from '@/lib/facebook/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }
    
    const supabase = createServerClient()
    
    // Get messages for conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    return NextResponse.json(messages)
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
    
    const supabase = createServerClient()
    
    // Get conversation and page details
    const { data: conversation } = await supabase
      .from('conversations')
      .select(`
        *,
        pages!inner(access_token, facebook_page_id)
      `)
      .eq('id', conversationId)
      .single()
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    
    // Send message via Facebook
    const fbClient = new FacebookClient(conversation.pages.access_token)
    await fbClient.sendMessage(
      conversation.participant_id,
      message,
      conversation.pages.access_token
    )
    
    // Store message in database
    const { data: savedMessage, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: conversation.pages.facebook_page_id,
        message,
        is_from_page: true
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update conversation
    await supabase
      .from('conversations')
      .update({
        last_message: message,
        last_message_time: new Date(),
        unread_count: 0
      })
      .eq('id', conversationId)
    
    return NextResponse.json(savedMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
