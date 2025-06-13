"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Check, Save, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface TopNavProps {
    previewData: {
        id: string
        title: string
        status: string
        slug: string
    }
}

const TopNav = ({ previewData }: TopNavProps) => {
    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const router = useRouter()

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            // TODO: Add actual publish logic here (update database status, etc.)
            await new Promise(resolve => setTimeout(resolve, 1500))
            router.push(`/${previewData.slug}`)
        } catch (error) {
            console.error('Failed to publish:', error)
        } finally {
            setIsPublishing(false)
        }
    }

    const handlePreview = () => {
        // Open blog preview in new tab
        window.open(`/dashboard/preview/${previewData.id}/blog`, '_blank')
    }
    
    return (
        <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 max-w-8xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="hover:bg-muted">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="hidden sm:block w-px h-6 bg-border" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-semibold truncate max-w-[300px]">{previewData.title}</h1>
                                <Badge variant="outline" className="text-xs">
                                    Draft
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground hidden sm:block">Preview and edit your generated page</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePreview}
                            className="hover:bg-muted"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                        
                        <Button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            size="lg"
                            className="group relative bg-black text-white hover:bg-gray-800 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Check className="mr-2 h-4 w-4 relative" />
                            <span className='relative text-white'>{isPublishing ? 'Publishing...' : 'Publish'}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNav