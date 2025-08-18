import axios from 'axios'

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0'

export class FacebookClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getPages() {
    try {
      console.log('Fetching pages with access token...')
      const response = await axios.get(`${GRAPH_API_URL}/me/accounts`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,category,access_token'
        }
      })
      console.log('Pages response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching pages:', error)
      throw error
    }
  }

  async getConversations(pageId: string) {
    try {
      console.log('Fetching conversations for page:', pageId)
      // First get the page access token
      const pages = await this.getPages()
      const page = pages.find((p: any) => p.id === pageId)
      
      if (!page) {
        throw new Error('Page not found')
      }
      
      const pageAccessToken = page.access_token
      
      const response = await axios.get(
        `${GRAPH_API_URL}/${pageId}/conversations`,
        {
          params: {
            access_token: pageAccessToken,
            fields: 'participants,messages{message,from,created_time,attachments},updated_time'
          }
        }
      )
      console.log('Conversations response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
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

  async sendMessage(pageId: string, conversationId: string, message: string) {
    try {
      console.log('Sending message to conversation:', conversationId, 'page:', pageId)
      // First get the page access token
      const pages = await this.getPages()
      const page = pages.find((p: any) => p.id === pageId)
      
      if (!page) {
        throw new Error('Page not found')
      }
      
      const pageAccessToken = page.access_token
      
      const response = await axios.post(
        `${GRAPH_API_URL}/me/messages`,
        {
          recipient: { id: conversationId },
          message: { text: message }
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

  async getPageSubscribers(pageId: string) {
    try {
      console.log('Getting subscribers for page:', pageId)
      // First get the page access token
      const pages = await this.getPages()
      const page = pages.find((p: any) => p.id === pageId)
      
      if (!page) {
        throw new Error('Page not found')
      }
      
      const pageAccessToken = page.access_token
      
      // Get users who messaged in last 24 hours (Facebook policy)
      const response = await axios.get(
        `${GRAPH_API_URL}/${pageId}/conversations`,
        {
          params: {
            access_token: pageAccessToken,
            fields: 'participants,updated_time'
          }
        }
      )
      
      const now = new Date()
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      const recentConversations = response.data.data.filter((conv: any) => {
        const updatedTime = new Date(conv.updated_time)
        return updatedTime > dayAgo
      })
      
      console.log('Recent conversations for subscribers:', recentConversations)
      return recentConversations
    } catch (error) {
      console.error('Error getting page subscribers:', error)
      throw error
    }
  }
}
