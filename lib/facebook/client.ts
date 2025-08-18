import axios from 'axios'

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0'

export class FacebookClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getPages() {
    const response = await axios.get(`${GRAPH_API_URL}/me/accounts`, {
      params: {
        access_token: this.accessToken,
        fields: 'id,name,category,access_token'
      }
    })
    return response.data.data
  }

  async getConversations(pageId: string, pageAccessToken: string) {
    const response = await axios.get(
      `${GRAPH_API_URL}/${pageId}/conversations`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'participants,messages{message,from,created_time,attachments}'
        }
      }
    )
    return response.data.data
  }

  async getMessages(conversationId: string, pageAccessToken: string) {
    const response = await axios.get(
      `${GRAPH_API_URL}/${conversationId}/messages`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'id,message,from,created_time,attachments'
        }
      }
    )
    return response.data.data
  }

  async sendMessage(
    recipientId: string,
    message: string,
    pageAccessToken: string
  ) {
    const response = await axios.post(
      `${GRAPH_API_URL}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message }
      },
      {
        params: { access_token: pageAccessToken }
      }
    )
    return response.data
  }

  async getPageSubscribers(pageId: string, pageAccessToken: string) {
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
    
    return response.data.data.filter((conv: any) => {
      const updatedTime = new Date(conv.updated_time)
      return updatedTime > dayAgo
    })
  }
}
