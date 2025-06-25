import type { Metadata } from "next"
import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export const metadata: Metadata = {
    title: "Dashboard",
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

    return (
        <SidebarProvider>
            <AppSidebar user={{
                name: user.name,
                email: user.email, 
                image: user.image
            }} />
            <SidebarInset className="border shadow-none">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

