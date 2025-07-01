
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Preview",
    description: "Preview Mode",
}

export default async function DashboardLayout({
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