import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MoneyStats } from "@/components/dashboard/money-stats"
import { PageCard } from "@/components/dashboard/page-card"
import { EmptyState } from "@/components/dashboard/empty-state"

// Mock data for development - simplified to just pages
const mockPages = [
  {
    id: "1",
    title: "JavaScript Design Patterns",
    description: "A comprehensive guide to modern JavaScript design patterns and best practices.",
    status: "published" as const,
    price: 29.99,
    views: 1234,
    sales: 89,
    slug: "javascript-design-patterns"
  },
  {
    id: "2", 
    title: "React Best Practices",
    description: "Learn the latest React patterns and how to build maintainable applications.",
    status: "draft" as const,
    price: 39.99,
    views: 0,
    sales: 0,
    slug: "react-best-practices"
  },
  {
    id: "3",
    title: "Python Data Analysis Guide",
    description: "Complete guide to data analysis with Python, pandas, and numpy.",
    status: "published" as const,
    price: 49.99,
    views: 0,
    sales: 0,
    progress: 75
  }
]

// Calculate mock stats from pages data
const calculateStats = () => {
  const totalSales = mockPages.reduce((sum, page) => sum + page.sales, 0)
  const totalRevenue = mockPages.reduce((sum, page) => sum + (page.sales * page.price), 0)
  const monthlySales = Math.floor(totalSales * 0.3) // Assuming 30% of sales this month
  const monthlyRevenue = mockPages.reduce((sum, page) => sum + (Math.floor(page.sales * 0.3) * page.price), 0)
  
  return {
    totalRevenue,
    monthlyRevenue,
    revenueGrowth: 12.5, // Mock growth percentage
    totalSales,
    salesGrowth: 8.3, // Mock growth percentage
  }
}

async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    const stats = calculateStats()

    return (
        <div className="space-y-8 w-11/12 lg:max-w-7xl mx-auto my-10">
            {/* Header Section */}
            <div className="mt-10">
                <DashboardHeader />
            </div>

            {/* Money Stats */}
            <MoneyStats {...stats} />

            {/* Pages Section */}
            <div className="space-y-6">
                {mockPages.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Your Pages ({mockPages.length})
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {mockPages.map((page) => (
                                <PageCard key={page.id} {...page} />
                            ))}
                        </div>
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    )
}

export default DashboardPage