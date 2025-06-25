import { CheckCircle, ArrowRight, Sparkles, FileText, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Subtle background pattern similar to hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000" />
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Success badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm px-6 py-3 text-sm text-gray-600 shadow-lg">
            <Sparkles className="mr-2 h-4 w-4 text-gray-500" />
            Payment successful
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8" color="green" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to Forged!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 leading-relaxed">
              Your subscription is now active.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Feature highlights */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 text-lg">What you can do now:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Upload your content</h4>
                    <p className="text-sm text-gray-600">Transform PDFs into structured courses</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">AI-powered generation</h4>
                    <p className="text-sm text-gray-600">Create beautiful, formatted playbooks instantly</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Set your pricing</h4>
                    <p className="text-sm text-gray-600">Monetize your expertise and start earning</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-xl py-6 text-lg rounded-xl">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}