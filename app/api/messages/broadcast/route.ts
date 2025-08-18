import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { FacebookClient } from '@/lib/facebook/client'
import { processSpintax } from '@/lib/utils/spintax'

export async function POST(request: NextRequest) {
  const { pageId, message } = await request.json()
  const supabase = createServerClient()
  
  // Get page details
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single()
  
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }
  
  const fbClient = new FacebookClient(page.access_token)
  
  // Get eligible subscribers (messaged in last 24 hours)
  const subscribers = await fbClient.getPageSubscribers(
    page.facebook_page_id,
    page.access_token
  )
  
  // Create broadcast record
  const { data: broadcast } = await supabase
    .from('broadcasts')
    .insert({
      page_id: pageId,
      message_template: message,
      recipient_count: subscribers.length,
      status: 'processing'
    })
    .select()
    .single()
  
  // Send messages asynchronously
  let sentCount = 0
  let failedCount = 0
  
  for (const subscriber of subscribers) {
    const recipientId = subscriber.participants.data.find(
      (p: any) => p.id !== page.facebook_page_id
    ).id
    
    // Process spintax for variation
    const personalizedMessage = processSpintax(message)
    
    try {
      await fbClient.sendMessage(
        recipientId,
        personalizedMessage,
        page.access_token
      )
      
      await supabase
        .from('broadcast_recipients')
        .insert({
          broadcast_id: broadcast.id,
          recipient_id: recipientId,
          message_sent: personalizedMessage,
          status: 'sent',
          sent_at: new Date()
        })
      
      sentCount++
      
      // Rate limiting - wait 100ms between messages
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      await supabase
        .from('broadcast_recipients')
        .insert({
          broadcast_id: broadcast.id,
          recipient_id: recipientId,
          message_sent: personalizedMessage,
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
      
      failedCount++
    }
  }
  
  // Update broadcast status
  await supabase
    .from('broadcasts')
    .update({
      sent_count: sentCount,
      failed_count: failedCount,
      status: 'completed',
      completed_at: new Date()
    })
    .eq('id', broadcast.id)
  
  return NextResponse.json({
    success: true,
    broadcast_id: broadcast.id,
    sent: sentCount,
    failed: failedCount
  })
}
