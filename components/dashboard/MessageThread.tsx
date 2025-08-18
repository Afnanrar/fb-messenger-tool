'use client'

import { useEffect, useRef } from 'react'
import { User, MessageSquare, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  message: string
  sender_id: string
  is_from_page: boolean
  created_at: string
}

interface MessageThreadProps {
  messages: Message[]
  currentPageId?: string
  onRefresh?: () => void
  loading?: boolean
}

export function MessageThread({ messages, currentPageId, onRefresh, loading = false }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Unknown'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      console.error('Error formatting time:', dateString, error)
      return 'Invalid time'
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="mt-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Messages
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Messages ({messages.length})</h3>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Messages */}
      {messages.map((message) => {
        const isFromPage = message.is_from_page
        
        return (
          <div
            key={message.id}
            className={`flex ${isFromPage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isFromPage ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isFromPage ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                {isFromPage ? (
                  <MessageSquare className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>

              {/* Message */}
              <div className={`px-4 py-2 rounded-lg ${
                isFromPage
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.message}
                </p>
                <p className={`text-xs mt-1 ${
                  isFromPage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
      
      <div ref={messagesEndRef} />
    </div>
  )
}
