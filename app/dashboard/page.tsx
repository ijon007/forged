import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MoneyStats } from "@/components/dashboard/money-stats"
import { PageCard } from "@/components/dashboard/page-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { getUserCourses } from "@/actions/course-db-actions"
import { type Course } from "@/db/schemas/course-schema"
import { authClient } from "@/lib/auth-client"

interface CourseWithRealData extends Course {
  sales: number
  priceInDollars: number
}

function calculateStats(courses: Course[]) {
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price || 0), 0) / 100;
  const totalSales = courses.length;
  
  const monthlyRevenue = totalRevenue * 0.3;
  const revenueGrowth = 12.5;
  const salesGrowth = 8.2;
  
  const coursesWithRealData: CourseWithRealData[] = courses.map(course => ({
    ...course,
    sales: Math.floor(Math.random() * 10),
    priceInDollars: (course.price || 0) / 100
  }));

  return {
    coursesWithRealData,
    totalRevenue,
    monthlyRevenue,
    revenueGrowth,
    totalSales,
    salesGrowth
  };
}

async function DashboardPage() {
    const session = await getSession()
    if (!session) {
        redirect("/login")
    }

    const { data: customerState } = await authClient.customer.state();
    if(customerState?.activeSubscriptions.length === 0) {
        redirect("/pricing")
    }

    const userCourses = await getUserCourses()
    const { coursesWithRealData, ...stats } = calculateStats(userCourses)

    const pageCards = coursesWithRealData.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        status: course.published ? "published" as const : "draft" as const,
        price: course.priceInDollars,
        views: 0,
        sales: course.sales,
        slug: course.id,
        imageUrl: course.imageUrl || undefined
    }))

    return (
        <div className="space-y-8 w-11/12 lg:max-w-7xl mx-auto my-10">
            <div className="mt-10">
                <DashboardHeader />
            </div>

            <MoneyStats {...stats} />

            <div className="space-y-6">
                {pageCards.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Your Pages ({pageCards.length})
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {pageCards.map((page) => (
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