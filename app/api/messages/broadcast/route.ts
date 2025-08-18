import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'
import { processSpintax } from '@/lib/utils/spintax'

export async function POST(request: NextRequest) {
  try {
    const { message, pageId, selectedSubscribers } = await request.json()
    const cookies = request.cookies
    const accessToken = cookies.get('fb_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 })
    }
    
    if (!message || !pageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    console.log('Sending broadcast message to page:', pageId)
    
    // Create Facebook client
    const facebookClient = new FacebookClient(accessToken)
    
    // Process spintax if present
    const processedMessage = processSpintax(message)
    
    let results = []
    
    if (selectedSubscribers && selectedSubscribers.length > 0) {
      // Send to specific subscribers
      console.log('Sending to selected subscribers:', selectedSubscribers.length)
      for (const subscriberId of selectedSubscribers) {
        try {
          const result = await facebookClient.sendMessage(pageId, subscriberId, processedMessage)
          results.push({ subscriberId, success: true, messageId: result.message_id })
        } catch (error) {
          console.error('Failed to send to subscriber:', subscriberId, error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          results.push({ subscriberId, success: false, error: errorMessage })
        }
      }
    } else {
      // Get all subscribers and send broadcast
      console.log('Getting all subscribers for broadcast')
      const subscribers = await facebookClient.getPageSubscribers(pageId)
      
      console.log('Sending broadcast to subscribers:', subscribers.length)
      for (const subscriber of subscribers) {
        try {
          const result = await facebookClient.sendMessage(pageId, subscriber.id, processedMessage)
          results.push({ subscriberId: subscriber.id, success: true, messageId: result.message_id })
        } catch (error) {
          console.error('Failed to send to subscriber:', subscriber.id, error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          results.push({ subscriberId: subscriber.id, success: false, error: errorMessage })
        }
      }
    }
    
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length
    
    console.log('Broadcast completed. Success:', successCount, 'Failures:', failureCount)
    
    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failures: failureCount
      }
    })
  } catch (error) {
    console.error('Error sending broadcast:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to send broadcast: ${errorMessage}` }, { status: 500 })
  }
}
