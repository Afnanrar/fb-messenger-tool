export interface WebhookEntry {
  id: string
  time: number
  messaging?: Array<{
    sender: {
      id: string
    }
    recipient: {
      id: string
    }
    message?: {
      mid: string
      text: string
      attachments?: Array<{
        type: string
        url: string
      }>
    }
    postback?: {
      payload: string
    }
  }>
}

export interface WebhookBody {
  object: string
  entry: WebhookEntry[]
}
