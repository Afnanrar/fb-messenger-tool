import { NextRequest, NextResponse } from 'next/server'
import { FacebookClient } from '@/lib/facebook/client'

export async function GET(request: NextRequest) {
  try {
    // For development: Return mock pages data
    const mockPages = [
      {
        id: 'dev-page-1',
        name: 'Test Facebook Page',
        category: 'Business',
        facebook_page_id: '123456789',
        access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN || 'your_page_access_token'
      }
    ]
    
    return NextResponse.json(mockPages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()
    
    // For development: Return mock pages
    const mockPages = [
      {
        id: 'dev-page-1',
        name: 'Test Facebook Page',
        category: 'Business',
        facebook_page_id: '123456789',
        access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN || 'your_page_access_token'
      }
    ]
    
    return NextResponse.json(mockPages)
  } catch (error) {
    console.error('Error syncing pages:', error)
    return NextResponse.json({ error: 'Failed to sync pages' }, { status: 500 })
  }
}
