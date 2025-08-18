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
  const [error, setError] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<any>(null)

  useEffect(() => {
    console.log('InboxPage: selectedPage changed:', selectedPage)
    if (selectedPage) {
      fetchConversations()
    }
  }, [selectedPage])

  useEffect(() => {
    console.log('InboxPage: selectedConversation changed:', selectedConversation)
    if (selectedConversation && selectedPage) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation, selectedPage])

  const fetchConversations = async () => {
    if (!selectedPage) {
      console.log('InboxPage: No page selected, skipping conversation fetch')
      return
    }
    
    try {
      console.log('InboxPage: Fetching conversations for page:', selectedPage.id)
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/conversations?pageId=${selectedPage.id}`)
      console.log('InboxPage: Conversations response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('InboxPage: Conversations API error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
      }
      
      const data = await response.json()
      console.log('InboxPage: Conversations data received:', data)
      setConversations(data)
    } catch (error) {
      console.error('InboxPage: Error fetching conversations:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch conversations')
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    if (!selectedPage) {
      console.log('InboxPage: No page selected, skipping message fetch')
      return
    }
    
    try {
      console.log('InboxPage: Fetching messages for conversation:', conversationId, 'page:', selectedPage.id)
      const response = await fetch(`/api/messages?conversationId=${conversationId}&pageId=${selectedPage.id}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('InboxPage: Messages API error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
      }
      
      const data = await response.json()
      console.log('InboxPage: Messages data received:', data)
      setMessages(data)
    } catch (error) {
      console.error('InboxPage: Error fetching messages:', error)
      setMessages([])
    }
  }

  const sendMessage = async (message: string) => {
    if (!selectedConversation || !selectedPage) {
      console.log('InboxPage: Cannot send message - missing conversation or page')
      return
    }

    try {
      console.log('InboxPage: Sending message to conversation:', selectedConversation.id, 'page:', selectedPage.id)
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          pageId: selectedPage.id,
          message
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('InboxPage: Send message API error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
      }

      console.log('InboxPage: Message sent successfully')
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
      console.error('InboxPage: Error sending message:', error)
    }
  }

  const handlePageSelect = (page: any) => {
    console.log('InboxPage: Page selected:', page)
    setSelectedPage(page)
    setSelectedConversation(null) // Reset conversation when page changes
    setConversations([])
    setMessages([])
    setError(null)
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
            onPageSelect={handlePageSelect}
            selectedPage={selectedPage || undefined}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mx-4 mt-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={fetchConversations}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-1/3 border-r border-gray-200 bg-white">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {selectedPage ? 'No conversations found for this page' : 'Please select a page first'}
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelect={setSelectedConversation}
            />
          )}
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
