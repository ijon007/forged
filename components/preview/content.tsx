"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Copy, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ContentProps {
    previewData: {
        originalContent: string
        [key: string]: any // Allow additional properties
    }
}

const Content = ({ previewData }: ContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    
    const normalizedContent = previewData.originalContent.trim()
    const contentPreview = normalizedContent.substring(0, 300)
    const hasMoreContent = normalizedContent.length > 300

    const copyContent = () => {
        navigator.clipboard.writeText(normalizedContent)
        toast.success('Content copied to clipboard!')
    }

    return (
        <Card className="flex flex-col transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <CardTitle className="text-lg">Original PDF Content</CardTitle>
                            <CardDescription>
                                Extracted content from your uploaded PDF
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyContent}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <div className="space-y-3">
                    <div className="relative">
                        <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-4 rounded-lg leading-relaxed">
                            {isExpanded ? normalizedContent : contentPreview}
                            {!isExpanded && hasMoreContent && (
                                <span className="text-muted-foreground">...</span>
                            )}
                        </pre>
                        
                        {hasMoreContent && (
                            <div className="mt-3 flex justify-center">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-xs"
                                >
                                    {isExpanded ? (
                                        <>
                                            <ChevronUp className="mr-1 h-3 w-3" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="mr-1 h-3 w-3" />
                                            Show More ({Math.ceil((normalizedContent.length - 300) / 100)}0+ more chars)
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{normalizedContent.split(/\s+/).length} words</span>
                        <span>{normalizedContent.length} characters</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Content