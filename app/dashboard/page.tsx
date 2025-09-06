import { getSession, hasActiveSubscription } from "@/actions/auth-actions";
import { getUserCourses } from "@/actions/course-db-actions";
import { getPolarConnectionStatus } from "@/actions/polar-actions";
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageCard } from "@/components/dashboard/page-card";
import { DashboardPage } from "@/components/dashboard-page";

async function DashboardPageComponent() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return <DashboardPage showPlanSelection={false} />;
  }

  const isActive = await hasActiveSubscription();
  if (!isActive && user) {
    return <DashboardPage showPlanSelection={true} />;
  }

  const [polarStatus, userCourses] = await Promise.all([
    getPolarConnectionStatus(),
    getUserCourses(),
  ]);

  const pageCards = userCourses.map((course) => ({
    id: course.id,
    imageUrl: course.imageUrl || "",
    title: course.title,
    description: course.description,
    status: course.published ? ("published" as const) : ("draft" as const),
    price: (course.price || 0) / 100,
    slug: course.id,
    contentType: course.contentType,
  }));

  return (
    <DashboardClientWrapper polarStatus={polarStatus}>
      <div className="z-10 mx-auto my-5 w-11/12 space-y-8 lg:my-10 lg:max-w-7xl">
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
  );
}

export default DashboardPageComponent;
