'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Clock, User } from 'lucide-react'

interface Conversation {
  id: string
  participant_id: string
  last_message: string
  last_message_time: string
  unread_count: number
  pages: {
    name: string
  }
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conversation: Conversation) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter(conv => {
    const message = conv.last_message || ''
    const participant = conv.participant_id || ''
    
    return message.toLowerCase().includes(searchTerm.toLowerCase()) ||
           participant.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Unknown'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
      return date.toLocaleDateString()
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return 'Invalid date'
    }
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (!message) return 'No message'
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={`
                p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50
                ${selectedId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participant_id || 'Unknown User'}
                      </p>
                      {conversation.unread_count > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {truncateMessage(conversation.last_message)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(conversation.last_message_time)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
