import type { Metadata } from "next"
import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"
import { getUserCourses } from "@/actions/course-db-actions"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export const metadata: Metadata = {
    title: {
        default: "Dashboard",
        template: "%s | Dashboard",
    },
    description: "Dashboard",
}

export default async function DashboardLayout({
    children,
}: {
  children: React.ReactNode
}) {
    const session = await getSession()
    const user = session?.user
    if (!user) {
        redirect("/login")
    }

    // Fetch user courses on the server to eliminate client-side fetching
    const userCourses = await getUserCourses()

    return (
        <SidebarProvider>
            <AppSidebar 
                user={{
                    name: user.name,
                    email: user.email, 
                    image: user.image
                }}
                userCourses={userCourses}
            />
            <SidebarInset className="border shadow-none relative overflow-hidden">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

