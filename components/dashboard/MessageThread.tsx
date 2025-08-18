'use client'

import { useEffect, useRef } from 'react'
import { User, MessageSquare } from 'lucide-react'

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
}

export function MessageThread({ messages, currentPageId }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
