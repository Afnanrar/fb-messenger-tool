import { NextRequest, NextResponse } from 'next/server'
import { processSpintax } from '@/lib/utils/spintax'

export async function POST(request: NextRequest) {
  try {
    const { pageId, message } = await request.json()
    
    if (!pageId || !message) {
      return NextResponse.json({ error: 'Page ID and message required' }, { status: 400 })
    }
    
    // For development: Simulate broadcast
    const mockRecipients = 25
    const mockSent = 23
    const mockFailed = 2
    
    // Process spintax for demonstration
    const sampleVariations = [
      processSpintax(message),
      processSpintax(message),
      processSpintax(message)
    ]
    
    return NextResponse.json({
      success: true,
      broadcast_id: 'broadcast-dev-1',
      sent: mockSent,
      failed: mockFailed,
      message: `Development mode: Would send to ${mockRecipients} recipients`,
      variations: sampleVariations
    })
  } catch (error) {
    console.error('Broadcast error:', error)
    return NextResponse.json({ 
      error: 'Failed to send broadcast',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
