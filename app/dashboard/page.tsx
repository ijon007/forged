import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MoneyStats } from "@/components/dashboard/money-stats"
import { PageCard } from "@/components/dashboard/page-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { getUserCourses } from "@/actions/course-db-actions"
import { getPolarConnectionStatus } from "@/actions/polar-actions"
import { type Course } from "@/db/schemas/course-schema"
import { authClient } from "@/lib/auth-client"
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper"


async function DashboardPage() {
    const session = await getSession()
    if (!session) {
        redirect("/login")
    }

    const { data: customerState } = await authClient.customer.state();
    if(customerState?.activeSubscriptions.length === 0) {
        redirect("/pricing")
    }

    // Check Polar connection status
    const polarStatus = await getPolarConnectionStatus();

    const userCourses = await getUserCourses()
    const stats = {
        totalRevenue: 0,
        monthlyRevenue: 0,
        revenueGrowth: 0,
        totalSales: 0,
        salesGrowth: 0
    }

    const pageCards = userCourses.map(course => ({
        id: course.id,
        imageUrl: course.imageUrl || "",
        title: course.title,
        description: course.description,
        status: course.published ? "published" as const : "draft" as const,
        price: (course.price || 0) / 100, // Convert from cents to dollars
        slug: course.id,
    }))

    return (
        <DashboardClientWrapper polarStatus={polarStatus}>
            <div className="space-y-8 w-11/12 lg:max-w-7xl mx-auto my-10">
                <div className="mt-10">
                    <DashboardHeader polarStatus={polarStatus} />
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
        </DashboardClientWrapper>
    )
}

export default DashboardPage