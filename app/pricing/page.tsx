import { getSession } from "@/actions/auth-actions"
import { PlanSelection } from "@/components/plan-selection"
import { redirect } from "next/navigation"

export default async function PricingPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start creating unlimited knowledge pages and keep 100% of your earnings
          </p>
        </div>
        <PlanSelection userId={session.user.id} />
      </div>
    </div>
  )
} 