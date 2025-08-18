'use client'

import { Button } from '@/components/ui/button'
import { Facebook } from 'lucide-react'

export function FacebookLoginButton() {
  const handleLogin = () => {
    window.location.href = '/api/auth/facebook'
  }

  return (
    <Button 
      onClick={handleLogin}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      size="lg"
    >
      <Facebook className="mr-2 h-5 w-5" />
      Continue with Facebook
    </Button>
  )
}
