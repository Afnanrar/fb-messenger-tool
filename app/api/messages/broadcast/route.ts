import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'
import { processSpintax } from '@/lib/utils/spintax'

export async function POST(request: NextRequest) {
  try {
    const { 
      pageId, 
      message, 
      messageTag,
      scheduled,
      scheduledTime,
      audienceType 
    } = await request.json()
    
    // Get page token from environment or database
    const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    const fbPageId = process.env.FACEBOOK_PAGE_ID || pageId
    
    if (!pageToken || !fbPageId) {
      return NextResponse.json({ 
        error: 'Page not configured',
        success: false 
      }, { status: 400 })
    }
    
    const fbClient = new FacebookClient(pageToken)
    
    // Get eligible recipients based on audience type
    let recipients = []
    
    try {
      // Get conversations from Facebook
      const conversations = await fbClient.getConversations(fbPageId, pageToken)
      
      // Filter based on 24-hour policy
      const now = new Date()
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      recipients = conversations.filter((conv: any) => {
        const lastInteraction = new Date(conv.updated_time)
        return lastInteraction > dayAgo
      }).map((conv: any) => ({
        id: conv.participants?.data?.find((p: any) => p.id !== fbPageId)?.id,
        name: conv.participants?.data?.find((p: any) => p.id !== fbPageId)?.name
      })).filter((r: any) => r.id)
    } catch (error) {
      console.error('Error fetching recipients:', error)
    }
    
    // Create broadcast record (simplified for now)
    const broadcastId = Date.now().toString()
    
    // If scheduled, return scheduled response
    if (scheduled) {
      return NextResponse.json({
        success: true,
        broadcast_id: broadcastId,
        scheduled: true,
        scheduled_for: scheduledTime,
        total_recipients: recipients.length
      })
    }
    
    // Send messages immediately
    let sentCount = 0
    let failedCount = 0
    const results = []
    
    for (const recipient of recipients) {
      // Process spintax and personalize message
      let personalizedMessage = processSpintax(message)
      personalizedMessage = personalizedMessage.replace('%(name)s', recipient.name || 'there')
      
      try {
        // Send message with proper message tag
        const response = await fbClient.sendMessage(
          recipient.id,
          personalizedMessage,
          pageToken,
          messageTag
        )
        
        // Record success
        sentCount++
        results.push({ 
          recipient_id: recipient.id, 
          status: 'sent' 
        })
        
        // Rate limiting - Facebook allows 200 msgs/sec but let's be safe
        await new Promise(resolve => setTimeout(resolve, 50))
        
      } catch (error: any) {
        console.error(`Failed to send to ${recipient.id}:`, error)
        
        failedCount++
        results.push({ 
          recipient_id: recipient.id, 
          status: 'failed',
          error: error.message 
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      broadcast_id: broadcastId,
      total: recipients.length,
      sent: sentCount,
      failed: failedCount,
      results: results
    })
    
  } catch (error: any) {
    console.error('Broadcast error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to send broadcast',
      success: false 
    }, { status: 500 })
  }
}

// GET endpoint to fetch broadcast history
export async function GET(request: NextRequest) {
  try {
    // For now, return mock data
    // In production, this would fetch from your database
    const mockBroadcasts = [
      {
        id: '495457',
        status: 'completed',
        progress: 100,
        message_template: '%(name)s! Wanna Tripple Cashout???',
        recipient_count: 1523,
        sent_count: 1523,
        failed_count: 0,
        created_at: new Date().toISOString()
      },
      {
        id: '479126',
        status: 'completed',
        progress: 100,
        message_template: 'Last Call...........',
        recipient_count: 892,
        sent_count: 892,
        failed_count: 0,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    
    return NextResponse.json({
      success: true,
      broadcasts: mockBroadcasts
    })
    
  } catch (error: any) {
    console.error('Error fetching broadcasts:', error)
    return NextResponse.json({ 
      error: error.message,
      success: false 
    }, { status: 500 })
  }
}
