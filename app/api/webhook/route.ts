import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  if (mode === 'subscribe' && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge)
  }
  
  return new NextResponse('Forbidden', { status: 403 })
}

// Handle webhook events
export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createServerClient()
  
  // Process each entry
  for (const entry of body.entry) {
    const pageId = entry.id
    
    // Find the page in database
    const { data: page } = await supabase
      .from('pages')
      .select('*')
      .eq('facebook_page_id', pageId)
      .single()
    
    if (!page) continue
    
    // Process messaging events
    if (entry.messaging) {
      for (const event of entry.messaging) {
        if (event.message) {
          // Handle incoming message
          const senderId = event.sender.id
          const messageText = event.message.text
          const messageId = event.message.mid
          
          // Find or create conversation
          let { data: conversation } = await supabase
            .from('conversations')
            .select('*')
            .eq('page_id', page.id)
            .eq('participant_id', senderId)
            .single()
          
          if (!conversation) {
            const { data: newConv } = await supabase
              .from('conversations')
              .insert({
                page_id: page.id,
                facebook_conversation_id: `${pageId}_${senderId}`,
                participant_id: senderId,
                last_message: messageText,
                last_message_time: new Date(),
                unread_count: 1
              })
              .select()
              .single()
            
            conversation = newConv
          } else {
            // Update conversation
            await supabase
              .from('conversations')
              .update({
                last_message: messageText,
                last_message_time: new Date(),
                unread_count: conversation.unread_count + 1
              })
              .eq('id', conversation.id)
          }
          
          // Store message
          await supabase
            .from('messages')
            .insert({
              conversation_id: conversation.id,
              facebook_message_id: messageId,
              sender_id: senderId,
              message: messageText,
              is_from_page: false
            })
        }
      }
    }
  }
  
  return NextResponse.json({ received: true })
}
