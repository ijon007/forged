"use client"

/* React */
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/* Components */
import CourseHeader from "./course-header"
import PublishedContent from "./content"
import CourseSidebar from "./course-sidebar"
import PoweredByBadge from "./powered-by-badge"
import CourseJsonLd from "./course-json-ld"
import { AccessCodeDialog, AccessCodeInputDialog } from "./access-code-dialog"

/* Actions */
// Removed database actions for now - using simple access code logic

interface CoursePageClientProps {
  page: {
    id: string
    title: string
    description: string
    price: number
    isPurchased: boolean
    author: string
    readTime: string
    imageUrl: string
    content: string
    tags: string[]
    keyPoints: string[]
  }
  accessCode?: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export default function CoursePage({ page, slug, createdAt, updatedAt }: CoursePageClientProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [generatedAccessCode, setGeneratedAccessCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessCodeFromUrl = searchParams.get('access_code')
    const fromManualEntry = searchParams.get('manual') === 'true'
    
    if (accessCodeFromUrl) {
      setHasAccess(true)
      setGeneratedAccessCode(accessCodeFromUrl)
      
      if (!fromManualEntry) {
        setShowSuccessDialog(true)
      }
    } else {
      setShowInputDialog(true)
    }
  }, [searchParams])

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
  }

  const handleAccessCodeSubmit = async (code: string) => {
    setIsLoading(true)
    setError("")

    setHasAccess(true)
    setShowInputDialog(false)
    const url = new URL(window.location.href)
    url.searchParams.set('access_code', code)
    url.searchParams.set('manual', 'true') 
    router.replace(url.toString())
    
    setIsLoading(false)
  }

  const pageWithAccess = { ...page, isPurchased: hasAccess }

  return (
    <>
      <CourseJsonLd
        title={page.title}
        description={page.description}
        imageUrl={page.imageUrl}
        author={page.author}
        slug={slug}
        tags={page.tags}
        price={page.price}
        createdAt={createdAt}
        updatedAt={updatedAt}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 w-11/12 lg:w-10/12">
          <CourseHeader
            title={page.title}
            description={page.description}
            author={page.author}
            readTime={page.readTime}
            imageUrl={page.imageUrl}
          />
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <PublishedContent page={pageWithAccess} />
            </div>
            <CourseSidebar
              price={page.price}
              keyPoints={page.keyPoints}
              tags={page.tags}
              isPurchased={hasAccess}
              courseId={page.id}
            />
          </div>
        </div>
        <PoweredByBadge />
      </div>

      <AccessCodeDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        accessCode={generatedAccessCode}
        courseTitle={page.title}
      />

      <AccessCodeInputDialog
        isOpen={showInputDialog}
        onSubmit={handleAccessCodeSubmit}
        isLoading={isLoading}
        error={error}
        onClose={() => setShowInputDialog(false)}
      />
    </>
  )
} 