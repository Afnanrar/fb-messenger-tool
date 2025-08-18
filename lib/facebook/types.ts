export interface FacebookPage {
  id: string
  name: string
  category: string
  access_token: string
}

export interface FacebookConversation {
  id: string
  participants: {
    data: Array<{
      id: string
      name: string
    }>
  }
  messages: {
    data: Array<{
      id: string
      message: string
      from: {
        id: string
        name: string
      }
      created_time: string
      attachments?: Array<{
        type: string
        url: string
      }>
    }>
  }
  updated_time: string
}

export interface FacebookMessage {
  id: string
  message: string
  from: {
    id: string
    name: string
  }
  created_time: string
  attachments?: Array<{
    type: string
    url: string
  }>
}

export interface FacebookUser {
  id: string
  name: string
  email?: string
}
