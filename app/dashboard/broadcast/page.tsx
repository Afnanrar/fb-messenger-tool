'use client'

import { useState, useEffect } from 'react'
import { 
  Send, 
  Clock, 
  Users,
  AlertTriangle,
  Calendar,
  Hash,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'

interface Campaign {
  id: string
  status: string
  progress: number
  message_template: string
  recipient_count: number
  sent_count: number
  failed_count: number
  created_at: string
}

export default function BroadcastPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [messageTag, setMessageTag] = useState('CONFIRMED_EVENT_UPDATE')
  const [scheduling, setScheduling] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [audienceType, setAudienceType] = useState('all')
  const [sending, setSending] = useState(false)
  const [stats, setStats] = useState({
    totalSent: 0,
    totalRecipients: 0,
    successRate: 0
  })

  // Facebook Message Tags (as per Graph API docs)
  const messageTags = [
    { value: 'CONFIRMED_EVENT_UPDATE', label: 'Confirmed Event Update', desc: 'Send notifications about confirmed events' },
    { value: 'POST_PURCHASE_UPDATE', label: 'Post-Purchase Update', desc: 'Updates about recent purchases' },
    { value: 'ACCOUNT_UPDATE', label: 'Account Update', desc: 'Non-promotional account updates' },
    { value: 'HUMAN_AGENT', label: 'Human Agent', desc: 'Message from human agent' },
  ]

  useEffect(() => {
    fetchCampaigns()
    const interval = setInterval(fetchCampaigns, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/messages/broadcast')
      const data = await response.json()
      
      if (data.success && data.broadcasts) {
        setCampaigns(data.broadcasts)
        
        // Calculate stats
        const total = data.broadcasts.reduce((acc: number, b: Campaign) => acc + b.sent_count, 0)
        const recipients = data.broadcasts.reduce((acc: number, b: Campaign) => acc + b.recipient_count, 0)
        const successRate = recipients > 0 ? (total / recipients * 100) : 0
        
        setStats({
          totalSent: total,
          totalRecipients: recipients,
          successRate: Math.round(successRate * 10) / 10
        })
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const handleSendBroadcast = async () => {
    if (!message.trim()) return
    
    setSending(true)
    
    try {
      const response = await fetch('/api/messages/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
          message,
          messageTag,
          scheduled: scheduling,
          scheduledTime: scheduling ? scheduledTime : null,
          audienceType
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('')
        setShowNewMessage(false)
        fetchCampaigns() // Refresh the list
        
        // Show success notification
        alert(`Broadcast sent successfully! Sent: ${data.sent}, Failed: ${data.failed}`)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending broadcast:', error)
      alert('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] p-6">
      {/* Floating Gradients */}
      <div className="floating-gradient gradient-1"></div>
      <div className="floating-gradient gradient-2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Broadcast Center
              </h1>
              <p className="text-gray-400 mt-2">Reach your audience with powerful messaging</p>
            </div>
            
            <button
              onClick={() => setShowNewMessage(true)}
              className="btn-gradient flex items-center gap-2"
            >
              <Sparkles size={20} />
              Create Campaign
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Messages Sent</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.totalSent.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Send size={24} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Recipients</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.totalRecipients.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Users size={24} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.successRate}%
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <TrendingUp size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
                  <button
                    onClick={() => setShowNewMessage(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Warning */}
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="text-orange-400 flex-shrink-0" size={20} />
                    <div className="text-sm">
                      <p className="text-orange-400 font-semibold mb-1">Important Notice</p>
                      <p className="text-gray-300">
                        Messages must comply with Facebook's policies. Use message tags only for their intended purpose.
                        Misuse may result in page restrictions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Target className="inline mr-1" size={16} />
                        Target Audience
                      </label>
                      <select
                        value={audienceType}
                        onChange={(e) => setAudienceType(e.target.value)}
                        className="w-full bg-[#1e2341] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="all">All Active Users (24h)</option>
                        <option value="engaged">Highly Engaged Users</option>
                        <option value="recent">Recent Conversations</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Hash className="inline mr-1" size={16} />
                        Message Tag (For 24h+ Messaging)
                      </label>
                      <select
                        value={messageTag}
                        onChange={(e) => setMessageTag(e.target.value)}
                        className="w-full bg-[#1e2341] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        {messageTags.map(tag => (
                          <option key={tag.value} value={tag.value}>
                            {tag.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {messageTags.find(t => t.value === messageTag)?.desc}
                      </p>
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduling}
                          onChange={(e) => setScheduling(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-600 bg-[#1e2341] text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-300 flex items-center gap-2">
                          <Calendar size={16} />
                          Schedule for later
                        </span>
                      </label>
                      
                      {scheduling && (
                        <input
                          type="datetime-local"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="mt-3 w-full bg-[#1e2341] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Sparkles className="inline mr-1" size={16} />
                      Message Content
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi %(name)s! Your message here... Use {option1|option2} for variations."
                      className="w-full h-48 bg-[#1e2341] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        Use %(name)s for personalization
                      </span>
                      <span className="text-xs text-gray-400">
                        {message.length} characters
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowNewMessage(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendBroadcast}
                    disabled={sending || !message.trim()}
                    className="btn-gradient flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <RefreshCw className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Launch Campaign
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Campaigns Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Campaign History</h2>
              <button
                onClick={fetchCampaigns}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1e2341] border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Content</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Total</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Sent</th>
                  <th className="px-6 py-4 text-center text-gray-400 uppercase">Failed</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      No campaigns yet. Create your first campaign to get started!
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-[#1e2341] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        #{campaign.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        {campaign.status === 'completed' && (
                          <span className="status-pill status-success">
                            <CheckCircle size={14} />
                            Completed
                          </span>
                        )}
                        {campaign.status === 'processing' && (
                          <span className="status-pill status-warning">
                            <RefreshCw size={14} className="animate-spin" />
                            Processing
                          </span>
                        )}
                        {campaign.status === 'scheduled' && (
                          <span className="status-pill status-warning">
                            <Clock size={14} />
                            Scheduled
                          </span>
                        )}
                        {campaign.status === 'failed' && (
                          <span className="status-pill status-danger">
                            <XCircle size={14} />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="progress-container">
                            <div 
                              className="progress-fill"
                              style={{ width: `${campaign.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            {campaign.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300 truncate block max-w-xs">
                          {campaign.message_template}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-white">
                          {campaign.recipient_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-green-400">
                          {campaign.sent_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-red-400">
                          {campaign.failed_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {new Date(campaign.created_at).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
