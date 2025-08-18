'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, Info } from 'lucide-react'

export function BroadcastForm({ pageId }: { pageId: string }) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSend = async () => {
    setSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/messages/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, message })
      })

      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        setMessage('')
      }
    } catch (error) {
      setResult({ error: 'Failed to send broadcast' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broadcast Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Messages will only be sent to users who messaged your page in the last 24 hours (Facebook policy).
            Use {'{option1|option2}'} for spintax variations.
          </AlertDescription>
        </Alert>

        <Textarea
          placeholder="Type your broadcast message here... Use {Hello|Hi|Hey} for variations!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full"
        />

        <Button 
          onClick={handleSend} 
          disabled={!message || sending}
          className="w-full"
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Broadcast
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.error ? 'destructive' : 'default'}>
            <AlertDescription>
              {result.error ? (
                result.error
              ) : (
                `Successfully sent to ${result.sent} recipients. Failed: ${result.failed}`
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
