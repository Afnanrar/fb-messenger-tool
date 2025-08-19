import axios from 'axios'

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0'

export class FacebookClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getPages() {
    try {
      const response = await axios.get(
        `${GRAPH_API_URL}/me/accounts`,
        {
          params: {
            access_token: this.accessToken,
            fields: 'id,name,category,access_token'
          }
        }
      )
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching pages:', error)
      throw error
    }
  }

  async getConversations(pageId: string, pageAccessToken: string) {
    try {
      const response = await axios.get(
        `${GRAPH_API_URL}/${pageId}/conversations`,
        {
          params: {
            access_token: pageAccessToken,
            fields: 'participants,updated_time,messages{message,from,created_time}'
          }
        }
      )
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  async getMessages(pageId: string, conversationId: string) {
    try {
      console.log('Fetching messages for conversation:', conversationId, 'page:', pageId)
      // First get the page access token
      const pages = await this.getPages()
      const page = pages.find((p: any) => p.id === pageId)
      
      if (!page) {
        throw new Error('Page not found')
      }
      
      const pageAccessToken = page.access_token
      
      const response = await axios.get(
        `${GRAPH_API_URL}/${conversationId}/messages`,
        {
          params: {
            access_token: pageAccessToken,
            fields: 'id,message,from,created_time,attachments'
          }
        }
      )
      console.log('Messages response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  }

  async sendMessage(
    recipientId: string,
    message: string,
    pageAccessToken: string,
    messageTag?: string
  ) {
    const payload: any = {
      recipient: { id: recipientId },
      message: { text: message }
    }
    
    // Add message tag if provided (for sending outside 24-hour window)
    if (messageTag && messageTag !== 'none') {
      payload.messaging_type = 'MESSAGE_TAG'
      payload.tag = messageTag
    } else {
      payload.messaging_type = 'RESPONSE'
    }
    
    const response = await axios.post(
      `${GRAPH_API_URL}/me/messages`,
      payload,
      {
        params: { access_token: pageAccessToken }
      }
    )
    
    return response.data
  }

  async sendMessageToConversation(pageId: string, conversationId: string, message: string) {
    try {
      console.log('Sending message to conversation:', conversationId, 'page:', pageId)
      
      // First get the page access token
      const pages = await this.getPages()
      const page = pages.find((p: any) => p.id === pageId)
      
      if (!page) {
        throw new Error('Page not found')
      }
      
      const pageAccessToken = page.access_token
      
      // Get the conversation to find the participant ID
      const conversations = await this.getConversations(pageId, pageAccessToken)
      const conversation = conversations.find((conv: any) => conv.id === conversationId)
      
      if (!conversation) {
        throw new Error('Conversation not found')
      }
      
      // Extract the participant ID (the user who messaged the page)
      const participant = conversation.participants?.data?.[0] || conversation.participants?.[0]
      if (!participant || !participant.id) {
        throw new Error('No participant found in conversation')
      }
      
      const recipientId = participant.id
      console.log('Sending message to recipient:', recipientId)
      
      // Send message using the correct endpoint and recipient
      const response = await axios.post(
        `${GRAPH_API_URL}/me/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
          messaging_type: 'RESPONSE'
        },
        {
          params: { access_token: pageAccessToken }
        }
      )
      
      console.log('Send message response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  async getPageInfo(pageId: string, pageAccessToken: string) {
    const response = await axios.get(
      `${GRAPH_API_URL}/${pageId}`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'id,name,category,fan_count,talking_about_count'
        }
      }
    )
    return response.data
  }

  async getPageSubscribers(pageId: string) {
    try {
      const pages = await this.getPages()
      const page = pages.find((p: any) => p.id === pageId)
      
      if (!page) {
        throw new Error('Page not found')
      }
      
      const pageAccessToken = page.access_token
      
      // Get conversations as a proxy for subscribers
      const conversations = await this.getConversations(pageId, pageAccessToken)
      
      // Extract unique participants
      const subscribers = conversations.map((conv: any) => {
        const participant = conv.participants?.data?.find((p: any) => p.id !== pageId)
        return {
          id: participant?.id,
          name: participant?.name
        }
      }).filter((sub: any) => sub.id)
      
      return subscribers
    } catch (error) {
      console.error('Error getting page subscribers:', error)
      return []
    }
  }
}
