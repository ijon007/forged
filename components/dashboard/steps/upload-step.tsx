"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface UploadStepProps {
  file: File | null
  uploadProgress: number
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
}

export default function UploadStep({ file, uploadProgress, onFileUpload, onReset }: UploadStepProps) {
  return (
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
            onChange={onFileUpload}
          />
        </label>
      </div>
      
      {file && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{file.name}</span>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={uploadProgress} className="mt-2" />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 