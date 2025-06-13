import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"

async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="h-svh w-full flex items-center justify-center">
            <h1>Dashboard</h1>
            
        </div>
    )
}
export default DashboardPage