'use client'

import { useState, useEffect } from 'react'
import { PageSelector } from '@/components/dashboard/PageSelector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Send, Users, TrendingUp } from 'lucide-react'

interface Page {
  id: string
  name: string
  category: string
}

interface DashboardStats {
  totalConversations: number
  totalMessages: number
  unreadCount: number
  activePages: number
}

export default function DashboardPage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    totalMessages: 0,
    unreadCount: 0,
    activePages: 0
  })

  useEffect(() => {
    if (selectedPage) {
      fetchStats(selectedPage.id)
    }
  }, [selectedPage])

  const fetchStats = async (pageId: string) => {
    try {
      // In a real app, you'd have an API endpoint for stats
      // For now, we'll use mock data
      setStats({
        totalConversations: Math.floor(Math.random() * 100) + 50,
        totalMessages: Math.floor(Math.random() * 500) + 200,
        unreadCount: Math.floor(Math.random() * 20) + 5,
        activePages: 1
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your Facebook Messenger presence</p>
        </div>
        
        <PageSelector
          onPageSelect={setSelectedPage}
          selectedPage={selectedPage || undefined}
        />
      </div>

      {selectedPage ? (
        <>
          {/* Page Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>{selectedPage.name}</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {selectedPage.category}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Messages</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Pages</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activePages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="/dashboard/inbox"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">View Inbox</p>
                      <p className="text-sm text-gray-600">Check your conversations</p>
                    </div>
                  </div>
                </a>
                
                <a
                  href="/dashboard/broadcast"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Send Broadcast</p>
                      <p className="text-sm text-gray-600">Message multiple users</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">New message from John Doe</span>
                    <span className="text-gray-400">2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Broadcast sent to 45 recipients</span>
                    <span className="text-gray-400">1 hour ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Page access token refreshed</span>
                    <span className="text-gray-400">3 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Page Selected</h3>
            <p className="text-gray-600">Please select a Facebook page to view your dashboard</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
