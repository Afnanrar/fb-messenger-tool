'use client'

import { useState, useEffect } from 'react'
import { ConversationList } from '@/components/dashboard/ConversationList'
import { MessageThread } from '@/components/dashboard/MessageThread'
import { MessageInput } from '@/components/dashboard/MessageInput'
import { PageSelector } from '@/components/dashboard/PageSelector'

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

interface Message {
  id: string
  message: string
  sender_id: string
  is_from_page: boolean
  created_at: string
}

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<any>(null)

  useEffect(() => {
    if (selectedPage) {
      fetchConversations()
    }
  }, [selectedPage])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!selectedConversation) return

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          message
        })
      })

      // Refresh messages
      fetchMessages(selectedConversation.id)
      
      // Update conversation in list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, last_message: message, unread_count: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
            <p className="text-sm text-gray-600">Manage your conversations</p>
          </div>
          <PageSelector
            onPageSelect={setSelectedPage}
            selectedPage={selectedPage}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={setSelectedConversation}
          />
        </div>
        
        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {selectedConversation.participant_id.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.participant_id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.pages?.name}
                    </p>
                  </div>
                </div>
              </div>
              
              <MessageThread 
                messages={messages} 
                currentPageId={selectedPage?.id}
              />
              <MessageInput onSend={sendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
