'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Users, 
  Send, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/navigation'

interface Stats {
  totalMessages: number
  totalLeads: number
  activePages: number
  campaignsToday: number
  successRate: number
  avgResponseTime: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalMessages: 6978507,
    totalLeads: 45832,
    activePages: 12,
    campaignsToday: 8,
    successRate: 98.5,
    avgResponseTime: '2.3 min'
  })

  const recentActivity = [
    { type: 'campaign', message: 'Bulk message campaign #495457 completed', time: '5 minutes ago', status: 'success' },
    { type: 'page', message: 'New page "Gaming Slots" connected', time: '1 hour ago', status: 'info' },
    { type: 'lead', message: '523 new leads added from "Spinners Lounge"', time: '2 hours ago', status: 'success' },
    { type: 'campaign', message: 'Campaign #479126 failed - Rate limit exceeded', time: '3 hours ago', status: 'error' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your pages.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#192734] rounded-lg p-6 border border-[#38444d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.totalMessages.toLocaleString()}
                </p>
                <p className="text-green-500 text-sm mt-2 flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <MessageSquare className="text-[#1d9bf0]" size={32} />
            </div>
          </div>

          <div className="bg-[#192734] rounded-lg p-6 border border-[#38444d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Leads</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.totalLeads.toLocaleString()}
                </p>
                <p className="text-green-500 text-sm mt-2 flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  +523 today
                </p>
              </div>
              <Users className="text-[#1d9bf0]" size={32} />
            </div>
          </div>

          <div className="bg-[#192734] rounded-lg p-6 border border-[#38444d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Pages</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.activePages}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  All systems operational
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-[#192734] rounded-lg p-6 border border-[#38444d]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.successRate}%
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Avg response: {stats.avgResponseTime}
                </p>
              </div>
              <Send className="text-[#1d9bf0]" size={32} />
            </div>
          </div>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-[#192734] rounded-lg border border-[#38444d]">
            <div className="p-6 border-b border-[#38444d]">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#192734] rounded-lg border border-[#38444d]">
            <div className="p-6 border-b border-[#38444d]">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => router.push('/dashboard/broadcast')}
                className="w-full text-left p-4 bg-[#273340] hover:bg-[#38444d] rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Send className="text-[#1d9bf0]" size={20} />
                    <div>
                      <p className="text-white font-medium">Send Bulk Message</p>
                      <p className="text-xs text-gray-400">Reach all your leads instantly</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/dashboard/pages')}
                className="w-full text-left p-4 bg-[#273340] hover:bg-[#38444d] rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="text-[#1d9bf0]" size={20} />
                    <div>
                      <p className="text-white font-medium">Manage Pages</p>
                      <p className="text-xs text-gray-400">Connect or manage Facebook pages</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/dashboard/analytics')}
                className="w-full text-left p-4 bg-[#273340] hover:bg-[#38444d] rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="text-[#1d9bf0]" size={20} />
                    <div>
                      <p className="text-white font-medium">View Analytics</p>
                      <p className="text-xs text-gray-400">Track your performance metrics</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
