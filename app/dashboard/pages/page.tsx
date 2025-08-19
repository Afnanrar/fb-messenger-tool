'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Send, 
  MessageSquare, 
  FolderOpen,
  MoreVertical,
  RefreshCw,
  Plus,
  Facebook
} from 'lucide-react'
import Layout from '@/components/Layout'

interface Page {
  id: string
  name: string
  category: string
  avatar?: string
  stats: {
    leads: number
    groups: number
    messages: number
  }
}

export default function PagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    // Simulated data - replace with API call
    setPages([
      {
        id: '1',
        name: 'Spinners Lounge',
        category: 'Game Publisher',
        stats: { leads: 5482, groups: 12, messages: 45821 }
      },
      {
        id: '2',
        name: 'Gaming Slots',
        category: 'Game Publisher',
        stats: { leads: 3291, groups: 8, messages: 28453 }
      },
      {
        id: '3',
        name: 'Winners Lounge',
        category: 'Game Publisher',
        stats: { leads: 7823, groups: 15, messages: 62341 }
      }
    ])
    setLoading(false)
  }

  const handleAction = (pageId: string, action: string) => {
    switch(action) {
      case 'leads':
        router.push(`/dashboard/leads?page=${pageId}`)
        break
      case 'groups':
        router.push(`/dashboard/groups?page=${pageId}`)
        break
      case 'bulk':
        router.push(`/dashboard/broadcast?page=${pageId}`)
        break
      case 'conversations':
        router.push(`/dashboard/inbox?page=${pageId}`)
        break
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Facebook Pages</h1>
            <p className="text-gray-400 mt-1">Manage your connected Facebook pages and their conversations</p>
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-[#273340] hover:bg-[#38444d] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Facebook size={18} />
              <span>Connect Facebook</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={18} />
              <span>Add New Page</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex space-x-3">
          <button 
            onClick={() => router.push('/dashboard/broadcast/selected')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Send size={18} />
            <span>Bulk Message To Selected Pages</span>
          </button>
        </div>

        {/* Pages Table */}
        <div className="bg-[#192734] rounded-lg border border-[#38444d] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#273340] border-b border-[#38444d]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Page Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Groups
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38444d]">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-[#273340] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1d9bf0] rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">
                          {page.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{page.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{page.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-white">
                      {page.stats.leads.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-white">
                      {page.stats.groups}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-white">
                      {page.stats.messages.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleAction(page.id, 'leads')}
                        className="text-[#1d9bf0] hover:text-[#1a8cd8] text-sm font-medium"
                      >
                        Leads
                      </button>
                      <span className="text-gray-500">|</span>
                      <button
                        onClick={() => handleAction(page.id, 'groups')}
                        className="text-[#1d9bf0] hover:text-[#1a8cd8] text-sm font-medium"
                      >
                        Groups
                      </button>
                      <span className="text-gray-500">|</span>
                      <button
                        onClick={() => handleAction(page.id, 'bulk')}
                        className="text-[#1d9bf0] hover:text-[#1a8cd8] text-sm font-medium"
                      >
                        Bulk Messages
                      </button>
                      <span className="text-gray-500">|</span>
                      <button
                        onClick={() => handleAction(page.id, 'conversations')}
                        className="text-[#1d9bf0] hover:text-[#1a8cd8] text-sm font-medium"
                      >
                        View Conversations
                      </button>
                    </div>
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
