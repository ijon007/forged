import { Suspense } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function SuccessContent() {
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