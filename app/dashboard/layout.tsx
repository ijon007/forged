import type { Metadata } from "next";
import { getSession, hasActiveSubscription } from "@/actions/auth-actions";
import { getUserCourses } from "@/actions/course-db-actions";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  description: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <SidebarProvider>
        <AppSidebar
          hasActiveSubscription={false}
          user={null}
          userCourses={[]}
        />
        <SidebarInset className="relative overflow-hidden border shadow-none">
          {children}
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fetch user courses and subscription status on the server
  const [userCourses, isActive] = await Promise.all([
    getUserCourses(),
    hasActiveSubscription(),
  ]);

  return (
    <SidebarProvider>
      <AppSidebar
        hasActiveSubscription={isActive}
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
        }}
        userCourses={userCourses}
      />
      <SidebarInset className="relative overflow-hidden border shadow-none">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
