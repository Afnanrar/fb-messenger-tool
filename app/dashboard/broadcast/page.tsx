'use client'

import { useState, useEffect } from 'react'
import { PageSelector } from '@/components/dashboard/PageSelector'
import { BroadcastForm } from '@/components/dashboard/BroadcastForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Users, Clock, CheckCircle } from 'lucide-react'

interface Page {
  id: string
  name: string
  category: string
}

interface Broadcast {
  id: string
  message_template: string
  recipient_count: number
  sent_count: number
  failed_count: number
  status: string
  created_at: string
  completed_at?: string
}

export default function BroadcastPage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedPage) {
      fetchBroadcasts()
    }
  }, [selectedPage])

  const fetchBroadcasts = async () => {
    if (!selectedPage) return
    
    setLoading(true)
    try {
      // In a real app, you'd fetch from /api/broadcasts
      // For now, we'll use mock data
      const mockBroadcasts: Broadcast[] = [
        {
          id: '1',
          message_template: 'Hello {friend|buddy|pal}! How are you doing today?',
          recipient_count: 45,
          sent_count: 42,
          failed_count: 3,
          status: 'completed',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          message_template: 'Don\'t forget about our special offer! {Save|Get} 20% off today!',
          recipient_count: 67,
          sent_count: 65,
          failed_count: 2,
          status: 'completed',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
        }
      ]
      setBroadcasts(mockBroadcasts)
    } catch (error) {
      console.error('Error fetching broadcasts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <Send className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Broadcast</h1>
            <p className="text-sm text-gray-600">Send messages to multiple users</p>
          </div>
          <PageSelector
            onPageSelect={setSelectedPage}
            selectedPage={selectedPage}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {selectedPage ? (
          <>
            {/* Broadcast Form */}
            <div className="max-w-2xl">
              <BroadcastForm pageId={selectedPage.id} />
            </div>

            {/* Broadcast History */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Broadcast History</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : broadcasts.length > 0 ? (
                <div className="space-y-4">
                  {broadcasts.map((broadcast) => (
                    <Card key={broadcast.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(broadcast.status)}`}>
                                {getStatusIcon(broadcast.status)}
                                <span className="ml-1 capitalize">{broadcast.status}</span>
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatTime(broadcast.created_at)}
                              </span>
                            </div>
                            
                            <p className="text-gray-900 mb-3">{broadcast.message_template}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{broadcast.recipient_count} recipients</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>{broadcast.sent_count} sent</span>
                              </div>
                              {broadcast.failed_count > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Send className="w-4 h-4 text-red-600" />
                                  <span>{broadcast.failed_count} failed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Send className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No broadcasts yet</h3>
                    <p className="text-gray-600">Send your first broadcast message to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Send className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Page Selected</h3>
              <p className="text-gray-600">Please select a Facebook page to send broadcasts</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
