'use client'

import { Suspense, useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

function SuccessContent() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [subscriptionReady, setSubscriptionReady] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const checkoutId = searchParams.get('checkout_id')

  useEffect(() => {
    let pollInterval: NodeJS.Timeout
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max wait

    const checkSubscriptionStatus = async () => {
      try {
        attempts++
        
        // Check if subscription is active in our database
        const response = await fetch('/api/check-subscription', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const { hasActiveSubscription } = await response.json()
          
          if (hasActiveSubscription) {
            setSubscriptionReady(true)
            setIsProcessing(false)
            clearInterval(pollInterval)
            return
          }
        }

        // If we've exceeded max attempts, stop polling and show ready state
        if (attempts >= maxAttempts) {
          setSubscriptionReady(true)
          setIsProcessing(false)
          clearInterval(pollInterval)
        }
      } catch (error) {
        console.error('Error checking subscription status:', error)
        
        // If we've exceeded max attempts, stop polling and show ready state
        if (attempts >= maxAttempts) {
          setSubscriptionReady(true)
          setIsProcessing(false)
          clearInterval(pollInterval)
        }
      }
    }

    // Start polling immediately
    checkSubscriptionStatus()
    
    // Then poll every second
    pollInterval = setInterval(checkSubscriptionStatus, 1000)

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [checkoutId])

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Processing Payment...
            </CardTitle>
            <CardDescription>
              We're setting up your subscription. This usually takes just a few seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-gray-500">
              Please don't close this page
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to Knowledgesmith!
          </CardTitle>
          <CardDescription>
            Your subscription is now active. You can start creating unlimited knowledge pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">What's next?</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Upload your PDFs and notes</li>
              <li>• Generate beautiful knowledge pages</li>
              <li>• Set your pricing and start earning</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
} 