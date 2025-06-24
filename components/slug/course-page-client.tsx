"use client"

/* React */
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

/* Components */
import CourseHeader from "./course-header"
import PublishedContent from "./content"
import CourseSidebar from "./course-sidebar"
import PoweredByBadge from "./powered-by-badge"
import CourseJsonLd from "./course-json-ld"
import { AccessCodeDialog, AccessCodeInputDialog } from "./access-code-dialog"

/* Actions */
import { checkFirstTimeAccess, validateAccessCode } from "@/actions/course-db-actions"

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

export default function CoursePage({ page, accessCode, slug, createdAt, updatedAt }: CoursePageClientProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [generatedAccessCode, setGeneratedAccessCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      if (accessCode) {
        const result = await checkFirstTimeAccess(page.id, accessCode)
        if (result.success) {
          if (result.isFirstTime) {
            setGeneratedAccessCode(accessCode)
            setShowSuccessDialog(true)
          }
          setHasAccess(true)
        } else {
          setShowInputDialog(true)
        }
      } else {
        setShowInputDialog(true)
      }
    }

    checkAccess()
  }, [page.id, accessCode])

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
  }

  const handleAccessCodeSubmit = async (code: string) => {
    setIsLoading(true)
    setError("")

    const result = await validateAccessCode(page.id, code)
    
    if (result.success) {
      setHasAccess(true)
      setShowInputDialog(false)
      const url = new URL(window.location.href)
      url.searchParams.set('access_code', code)
      router.replace(url.toString())
    } else {
      setError(result.error || "Invalid access code")
    }
    
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