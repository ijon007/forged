"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Check, Save, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

interface TopNavProps {
    previewData: {
        title: string
        status: string
        slug: string
    }
}

const TopNav = ({ previewData }: TopNavProps) => {
    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        // Simulate publish operation
        await new Promise(resolve => setTimeout(resolve, 1500))
        redirect(`/${previewData.slug}`)
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
                            size="lg"
                            className="group relative bg-black text-white hover:bg-gray-800 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
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