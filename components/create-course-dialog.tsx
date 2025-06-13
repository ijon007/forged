"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, PlusCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CreateCourseDialogProps {
  children: React.ReactNode
}

export function CreateCourseDialog({ children }: CreateCourseDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"upload" | "details" | "generating">("upload")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [pageData, setPageData] = useState({
    title: "",
    description: "",
    price: ""
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(() => setStep("details"), 500)
        }
      }, 200)
    }
  }

  const handleSubmit = () => {
    setStep("generating")
    
    // Simulate AI generation with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setGenerationProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        // Simulate a brief completion state
        setTimeout(() => {
          setOpen(false)
          // Reset state
          setStep("upload")
          setFile(null)
          setUploadProgress(0)
          setGenerationProgress(0)
          setPageData({ title: "", description: "", price: "" })
          
          // Navigate to preview page with mock ID
          router.push("/dashboard/preview/1")
        }, 1000)
      }
    }, 100)
  }

  const handleReset = () => {
    setStep("upload")
    setFile(null)
    setUploadProgress(0)
    setGenerationProgress(0)
  }

  const getGenerationMessage = () => {
    if (generationProgress < 30) return "Extracting content from PDF..."
    if (generationProgress < 60) return "Analyzing structure and key points..."
    if (generationProgress < 90) return "Generating blog post content..."
    return "Finalizing your page..."
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Upload a PDF and we'll generate a beautiful blog page for you
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 border-muted-foreground/25">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> your PDF
                  </p>
                  <p className="text-xs text-muted-foreground">PDF files only</p>
                </div>
                <input 
                  id="pdf-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            
            {file && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Progress value={uploadProgress} className="mt-2" />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === "details" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                placeholder="Enter your page title"
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your content"
                value={pageData.description}
                onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="19.99"
                value={pageData.price}
                onChange={(e) => setPageData({ ...pageData, price: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Generate Page
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="space-y-6 text-center py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <PlusCircle className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Generating your page...</h3>
              <p className="text-sm text-muted-foreground">
                {getGenerationMessage()}
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{generationProgress}% complete</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 