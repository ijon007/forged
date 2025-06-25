/* Next */
import Link from "next/link"
import { redirect } from "next/navigation"

/* Components */
import { ArrowLeft, Sparkles } from "lucide-react"
import { GoogleLoginButton } from "@/components/login/login-google"

/* Actions */
import { getSession } from "@/actions/auth-actions"
import { authClient } from "@/lib/auth-client"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    const { data: customerState } = await authClient.customer.state();
    if(customerState?.activeSubscriptions.length === 0) {
        redirect("/pricing")
    }
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-black transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to home
      </Link>

      <div className="w-full max-w-md relative">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-xl" />

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-black to-gray-800 rounded-2xl mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Welcome!</h1>
              <p className="text-gray-600">
                Sign in to your Forged account
              </p>
            </div>

            {/* Social login */}
            <div className="space-y-3">
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
