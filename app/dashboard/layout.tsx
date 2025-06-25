import { TopNav } from "@/components/top-nav"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard",
}

export default function DashboardLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <div>
            <TopNav />
            {children}
        </div>
  )
}

