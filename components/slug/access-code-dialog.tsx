"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AccessCodeDialogProps {
  isOpen: boolean
  onClose: () => void
  accessCode: string
  courseTitle: string
}

export function AccessCodeDialog({ isOpen, onClose, accessCode, courseTitle }: AccessCodeDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accessCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🎉 Purchase Complete!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You now have access to <strong>{courseTitle}</strong>
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Your Access Code:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background p-2 rounded border font-mono text-lg font-bold">
                {accessCode}
              </code>
              <Button size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Save this code! You'll need it to access this course from anywhere.
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Continue to Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 

interface AccessCodeInputDialogProps {
    isOpen: boolean
    onSubmit: (code: string) => void
    isLoading: boolean
    error?: string
    onClose: () => void
}
  
export function AccessCodeInputDialog({ isOpen, onSubmit, isLoading, error, onClose }: AccessCodeInputDialogProps) {
    const [code, setCode] = useState("")
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (code.trim()) {
        onSubmit(code.trim())
      }
    }
  
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Access Code</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your access code to continue
            </p>
            
            <div className="space-y-2">
              <Input
                placeholder="KS-ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono"
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <Button type="submit" disabled={!code.trim() || isLoading} className="w-full">
              {isLoading ? "Checking..." : "Access Course"}
            </Button>
            
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Don't have access?
                  </span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" type="button" onClick={onClose}>
                I don&apos;t have an access code
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
} 