import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For development: Return default settings
    const defaultSettings = {
      notifications_enabled: true,
      auto_reply_enabled: false,
      auto_reply_message: 'Thanks for your message! I\'ll get back to you soon.',
      rate_limit_messages: 100,
      timezone: 'UTC'
    }
    
    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()
    
    // For development: Return updated settings
    return NextResponse.json({
      ...settings,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
