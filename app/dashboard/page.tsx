import { requireAuth, requireActiveSubscription } from "@/actions/auth-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PageCard } from "@/components/dashboard/page-card"
import { EmptyState } from "@/components/dashboard/empty-state"
import { getUserCourses } from "@/actions/course-db-actions"
import { getPolarConnectionStatus } from "@/actions/polar-actions"
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper"

async function DashboardPage() {
    // Require authentication and active subscription
    await requireAuth()
    await requireActiveSubscription()

    const [polarStatus, userCourses] = await Promise.all([
        getPolarConnectionStatus(),
        getUserCourses()
    ])

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
            <div className="space-y-8 w-11/12 lg:max-w-7xl mx-auto my-5 lg:my-10 z-10">
                <DashboardHeader />
                <div className="space-y-6">
                    {pageCards.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {pageCards.map((page) => (
                                <PageCard key={page.id} {...page} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </DashboardClientWrapper>
    )
}

export default DashboardPage