import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CreateCourseDialog } from "@/components/create-course-dialog"
import { CourseCard } from "@/components/course-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, BookOpen } from "lucide-react"

// Mock data for development - simplified to just pages
const mockPages = [
  {
    id: "1",
    title: "JavaScript Design Patterns",
    description: "A comprehensive guide to modern JavaScript design patterns and best practices.",
    status: "published" as const,
    price: 29.99,
    views: 1234,
    sales: 89,
    slug: "javascript-design-patterns"
  },
  {
    id: "2", 
    title: "React Best Practices",
    description: "Learn the latest React patterns and how to build maintainable applications.",
    status: "draft" as const,
    price: 39.99,
    views: 0,
    sales: 0,
    slug: "react-best-practices"
  },
  {
    id: "3",
    title: "Python Data Analysis Guide",
    description: "Complete guide to data analysis with Python, pandas, and numpy.",
    status: "generating" as const,
    price: 49.99,
    views: 0,
    sales: 0,
    progress: 75
  }
]

async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Pages</h1>
                    <p className="text-muted-foreground">
                        Transform your PDFs into beautiful, sellable blog pages
                    </p>
                </div>
                <CreateCourseDialog>
                    <Button size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Page
                    </Button>
                </CreateCourseDialog>
            </div>

            {/* Pages Grid */}
            <div className="space-y-4">
                {mockPages.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mockPages.map((page) => (
                            <CourseCard key={page.id} {...page} />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                        <BookOpen className="h-16 w-16 text-muted-foreground mb-6" />
                        <CardTitle className="mb-3 text-2xl">No pages yet</CardTitle>
                        <CardDescription className="mb-6 text-lg max-w-md">
                            Upload a PDF to create your first sellable blog page
                        </CardDescription>
                        <CreateCourseDialog>
                            <Button size="lg">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Your First Page
                            </Button>
                        </CreateCourseDialog>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default DashboardPage