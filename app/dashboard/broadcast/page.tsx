'use client'

import { useState, useEffect } from 'react'
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
  Plus,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  FileText
} from 'lucide-react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/navigation'

interface Campaign {
  id: string
  status: 'completed' | 'in_progress' | 'failed'
  progress: number
  content: string
  total: number
  sent: number
  failed: number
  createdAt: string
  completedAt?: string
  timeSpent?: string
}

export default function BroadcastPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [contentType, setContentType] = useState<'text' | 'image'>('text')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [scheduling, setScheduling] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    // Simulated data
    setCampaigns([
      {
        id: '495457',
        status: 'completed',
        progress: 100,
        content: '%(name)s! Wanna Tripple Cashout???',
        total: 1523,
        sent: 1523,
        failed: 0,
        createdAt: 'August 01, 2025 08:57 AM',
        completedAt: 'August 01, 2025 09:15 AM',
        timeSpent: 'less than a minute'
      },
      {
        id: '479126',
        status: 'completed',
        progress: 100,
        content: 'Last Call...........',
        total: 892,
        sent: 892,
        failed: 0,
        createdAt: 'July 28, 2025 09:04 AM',
        timeSpent: 'less than a minute'
      },
      {
        id: '477059',
        status: 'completed',
        progress: 100,
        content: '%(name)s! Are You...',
        total: 2341,
        sent: 2341,
        failed: 0,
        createdAt: 'July 27, 2025 11:58 PM',
        timeSpent: 'less than a minute'
      }
    ])
  }

  const handleSendBroadcast = async () => {
    if (!message.trim()) return

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      status: 'in_progress',
      progress: 0,
      content: message,
      total: 0,
      sent: 0,
      failed: 0,
      createdAt: new Date().toLocaleString()
    }

    setCampaigns([newCampaign, ...campaigns])
    setMessage('')
    setShowNewMessage(false)

    // Simulate sending
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setCampaigns(prev => prev.map(c => 
        c.id === newCampaign.id 
          ? { ...c, progress, status: progress >= 100 ? 'completed' : 'in_progress' }
          : c
      ))
      if (progress >= 100) clearInterval(interval)
    }, 200)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard/pages')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Bulk Messages for Spinners Lounge</h1>
              <p className="text-gray-400 mt-1">Send and manage bulk messages to your page leads</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowNewMessage(true)}
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>New Bulk Message</span>
          </button>
        </div>

        {/* New Message Form */}
        {showNewMessage && (
          <div className="bg-[#192734] rounded-lg border border-[#38444d] p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">New Bulk Message for Spinners Lounge</h2>
              <button 
                onClick={() => setShowNewMessage(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Warning Box */}
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-red-500 mt-1" size={20} />
                <div className="text-sm">
                  <p className="text-red-400 font-semibold mb-2">Page Reputation Warning</p>
                  <p className="text-gray-300">Please note that your page's reputation is in your hands. Misuse of bulk messaging can lead to:</p>
                  <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                    <li>Reduced engagement from users</li>
                    <li>Users marking messages as spam</li>
                    <li>Facebook imposing restrictions on your page</li>
                    <li>Permanent page suspension</li>
                  </ul>
                  <p className="text-gray-300 mt-2">Always ensure your messages are relevant and valuable to your audience.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Audience
                  </label>
                  <select 
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="w-full bg-[#273340] border border-[#38444d] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#1d9bf0]"
                  >
                    <option value="all">All Leads</option>
                    <option value="recent">Recent Activity (24h)</option>
                    <option value="engaged">Highly Engaged</option>
                    <option value="group">Specific Group</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">0 of 0 leads</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Content Type
                  </label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setContentType('text')}
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        contentType === 'text' 
                          ? 'bg-[#1d9bf0] border-[#1d9bf0] text-white' 
                          : 'bg-[#273340] border-[#38444d] text-gray-300'
                      }`}
                    >
                      <FileText size={18} className="inline mr-2" />
                      Text Message
                    </button>
                    <button
                      onClick={() => setContentType('image')}
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        contentType === 'image' 
                          ? 'bg-[#1d9bf0] border-[#1d9bf0] text-white' 
                          : 'bg-[#273340] border-[#38444d] text-gray-300'
                      }`}
                    >
                      <ImageIcon size={18} className="inline mr-2" />
                      Image/Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduling}
                      onChange={(e) => setScheduling(e.target.checked)}
                      className="w-4 h-4 bg-[#273340] border-[#38444d] rounded text-[#1d9bf0]"
                    />
                    <span className="text-sm text-gray-300">Enable Scheduling</span>
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here. Use %(name)s to include the recipient's name for personalization."
                  className="w-full h-48 bg-[#273340] border border-[#38444d] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1d9bf0] resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    <input type="checkbox" className="mr-1" />
                    Insert Recipient Name
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.length}/1000 characters
                  </span>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message Tag
                  </label>
                  <select className="w-full bg-[#273340] border border-[#38444d] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#1d9bf0]">
                    <option>Select a tag</option>
                    <option>CONFIRMED_EVENT_UPDATE</option>
                    <option>POST_PURCHASE_UPDATE</option>
                    <option>ACCOUNT_UPDATE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewMessage(false)}
                className="px-6 py-2 bg-[#273340] hover:bg-[#38444d] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-6 py-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send size={18} />
                <span>Send Messages</span>
              </button>
            </div>
          </div>
        )}

        {/* Campaigns Table */}
        <div className="bg-[#192734] rounded-lg border border-[#38444d] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#273340] border-b border-[#38444d]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created/Scheduled At
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38444d]">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-[#273340] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">{campaign.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.status === 'completed' && (
                      <span className="badge-success">Completed</span>
                    )}
                    {campaign.status === 'in_progress' && (
                      <span className="badge-warning">In Progress</span>
                    )}
                    {campaign.status === 'failed' && (
                      <span className="badge-danger">Failed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{campaign.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300 truncate block max-w-xs">
                      {campaign.content}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-white">{campaign.total}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-white">{campaign.sent}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{campaign.createdAt}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{campaign.timeSpent || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-400">-</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#1d9bf0] hover:text-[#1a8cd8] p-2">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
