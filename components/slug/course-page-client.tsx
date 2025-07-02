"use client"

/* React */
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/* Components */
import CourseHeader from "./course-header"
import CourseSidebar from "./course-sidebar"
import PoweredByBadge from "./powered-by-badge"
import CourseJsonLd from "./course-json-ld"
import { AccessCodeDialog, AccessCodeInputDialog } from "./access-code-dialog"

/* Actions */
import { validateAccessCode, markPurchaseCompleted } from "@/actions/course-db-actions"
import PublishedContent from "./content"

/* Types */
import type { CourseContent } from "@/db/schemas/course-schema"

interface CoursePageClientProps {
    page: {
        id: string
        title: string
        description: string
        price: number
        contentType: string
        isPurchased: boolean
        author: string
        readTime: string
        imageUrl: string
        content: CourseContent
        tags: string[]
        keyPoints: string[]
        links: any[]
    }
    accessCode?: string
    slug: string
    createdAt: Date
    updatedAt: Date
    isPreview?: boolean
}

export default function CoursePage({ page, slug, createdAt, updatedAt, isPreview = false }: CoursePageClientProps) {
    const [hasAccess, setHasAccess] = useState(isPreview ? true : false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [showInputDialog, setShowInputDialog] = useState(false)
    const [generatedAccessCode, setGeneratedAccessCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Skip all access code logic in preview mode
        if (isPreview) {
            setHasAccess(true)
            return
        }

        const accessCodeFromUrl = searchParams.get('access_code')
        const fromManualEntry = searchParams.get('manual') === 'true'
        
        if (accessCodeFromUrl) {
            const validateUrlAccessCode = async () => {
                try {
                    const result = await validateAccessCode(page.id, accessCodeFromUrl)
                    
                    if (result.success) {
                        setHasAccess(true)
                        setGeneratedAccessCode(accessCodeFromUrl)
                        
                        if (!fromManualEntry) {
                            setShowSuccessDialog(true)
                        }
                    } else {
                        setShowInputDialog(true)
                        setError("Invalid access code")
                    }
                } catch (error) {
                    setShowInputDialog(true)
                    setError("Failed to validate access code")
                }
            }
            
            validateUrlAccessCode()
        } else {
            if (page.price > 0) {
                setShowInputDialog(true)
            }
        }
    }, [searchParams, page.id, isPreview])

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false)
    }

    const handleAccessCodeSubmit = async (code: string) => {
        setIsLoading(true)
        setError("")

        try {
            const result = await validateAccessCode(page.id, code)
            
            if (result.success) {
                setHasAccess(true)
                setShowInputDialog(false)
                const url = new URL(window.location.href)
                url.searchParams.set('access_code', code)
                url.searchParams.set('manual', 'true') 
                router.replace(url.toString())
            } else {
                setError(result.error || "Invalid access code")
            }
        } catch (error) {
            setError("Failed to validate access code")
        }
        
        setIsLoading(false)
    }

    const handleContinueToCourse = async () => {
        try {
            await markPurchaseCompleted(page.id, generatedAccessCode)
        } catch (error) {
            console.error('Failed to mark purchase as completed:', error)
        }
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
                contentType={page.contentType}
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
                        contentType={page.contentType}
                    />
                    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="lg:col-span-3 min-w-0">
                            <PublishedContent page={pageWithAccess} />
                        </div>
                        <div className="order-1 lg:order-last">
                            <CourseSidebar
                                price={page.price}
                                keyPoints={page.keyPoints.slice(0, 5)}
                                tags={page.tags}
                                links={page.links}
                                isPurchased={hasAccess}
                                courseId={page.id}
                                contentType={page.contentType}
                            />
                        </div>
                    </div>
                </div>
                <PoweredByBadge />
            </div>

            {!isPreview && page.price > 0 && (
                <>
                    <AccessCodeDialog
                        isOpen={showSuccessDialog}
                        onClose={handleSuccessDialogClose}
                        accessCode={generatedAccessCode}
                        courseTitle={page.title}
                        onContinue={handleContinueToCourse}
                    />

                    <AccessCodeInputDialog
                        isOpen={showInputDialog}
                        onSubmit={handleAccessCodeSubmit}
                        isLoading={isLoading}
                        error={error}
                        onClose={() => setShowInputDialog(false)}
                    />
                </>
            )}
        </>
    )
} 