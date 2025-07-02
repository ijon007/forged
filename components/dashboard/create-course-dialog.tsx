"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateCourseFromPDF } from "@/actions/course-actions"
import { validatePDFFile } from "@/lib/pdf-parsing"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ContentType, CONTENT_TYPES } from "@/db/schemas/course-schema"
import UploadStep from "./steps/upload-step"
import ContentTypeStep from "./steps/content-type-step"
import DetailsStep from "./steps/details-step"
import GeneratingStep from "./steps/generating-step"

interface CreateCourseDialogProps {
    children: React.ReactNode
}

interface PageData {
    title: string
    description: string
    price: string
}

export function CreateCourseDialog({ children }: CreateCourseDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<"upload" | "contentType" | "details" | "generating">("upload")
    const [uploadProgress, setUploadProgress] = useState(0)
    const [generationProgress, setGenerationProgress] = useState(0)
    const [file, setFile] = useState<File | null>(null)
    const [contentType, setContentType] = useState<ContentType>(CONTENT_TYPES.BLOG)
    const [pageData, setPageData] = useState<PageData>({
        title: "",
        description: "",
        price: ""
    })

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (!selectedFile) return

        const validation = await validatePDFFile(selectedFile)
        if (!validation.valid) {
            toast.error(validation.error || "Invalid file")
            return
        }

        setFile(selectedFile)
        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            setUploadProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                setTimeout(() => setStep("contentType"), 500)
            }
        }, 200)
    }

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please select a PDF file")
            return
        }

        setStep("generating")
        
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', pageData.title)
            formData.append('description', pageData.description)
            formData.append('price', pageData.price)
            formData.append('contentType', contentType)

            const progressInterval = setInterval(() => {
                setGenerationProgress(prev => {
                if (prev >= 90) return prev
                    return prev + Math.random() * 10
                })
            }, 500)

            const result = await generateCourseFromPDF(formData)

            clearInterval(progressInterval)
            setGenerationProgress(100)

            if (result.success && result.data) {
                const successMessage = contentType === CONTENT_TYPES.COURSE 
                    ? "Course generated successfully!" 
                    : "Content generated successfully!"
                toast.success(successMessage)
                
                setTimeout(() => {
                    setOpen(false)
                    
                    setStep("upload")
                    setFile(null)
                    setUploadProgress(0)
                    setGenerationProgress(0)
                    setContentType(CONTENT_TYPES.BLOG)
                    setPageData({ title: "", description: "", price: "" })
                    
                    router.push(`/dashboard/preview/${result.data!.id}`)
                }, 1000)
            } else {
                toast.error(result.error || "Failed to generate course")
                setStep("details")
                setGenerationProgress(0)
            }
        } catch (error) {
            console.error('Generation error:', error)
            toast.error("An unexpected error occurred")
            setStep("details")
            setGenerationProgress(0)
        }
    }

    const handleReset = () => {
        setStep("upload")
        setFile(null)
        setUploadProgress(0)
        setGenerationProgress(0)
        setContentType(CONTENT_TYPES.BLOG)
    }

    const renderCurrentStep = () => {
        switch (step) {
            case "upload":
                return (
                    <UploadStep
                        file={file}
                        uploadProgress={uploadProgress}
                        onFileUpload={handleFileUpload}
                        onReset={handleReset}
                    />
                )
            case "contentType":
                return (
                    <ContentTypeStep
                        contentType={contentType}
                        onContentTypeChange={setContentType}
                        onBack={handleReset}
                        onContinue={() => setStep("details")}
                    />
                )
            case "details":
                return (
                    <DetailsStep
                        pageData={pageData}
                        onPageDataChange={setPageData}
                        onBack={() => setStep("contentType")}
                        onSubmit={handleSubmit}
                    />
                )
            case "generating":
                return (
                    <GeneratingStep
                        generationProgress={generationProgress}
                        contentType={contentType}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl">
                <DialogHeader>
                    <DialogTitle>Create New Content</DialogTitle>
                    <DialogDescription>
                        Upload a PDF and we'll generate professional content for you - blog posts, listicles, or interactive courses
                    </DialogDescription>
                </DialogHeader>

                {renderCurrentStep()}
            </DialogContent>
        </Dialog>
    )
} 