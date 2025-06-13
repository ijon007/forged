import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Knowledgesmith - Dashboard",
  description: "Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
