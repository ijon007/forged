"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Check, Save, ExternalLink, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { publishCourse, unpublishCourse } from '@/actions/course-db-actions'
import { toast } from 'sonner'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface TopNavProps {
    previewData: {
        id: string
        title: string
        status: string
        slug: string
        published?: boolean
        [key: string]: any // Allow additional properties
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
            const isCurrentlyPublished = previewData.published || previewData.status === 'published'
            
            if (isCurrentlyPublished) {
                // Unpublish the course
                const result = await unpublishCourse(previewData.id)
                if (result.success) {
                    toast.success('Course unpublished successfully!')
                    router.refresh()
                } else {
                    toast.error('Failed to unpublish: ' + (result.error || 'Unknown error'))
                }
            } else {
                // Publish the course
                const result = await publishCourse(previewData.id)
                if (result.success) {
                    toast.success('Course published successfully!')
                    // Redirect to the published blog post
                    router.push(`/${previewData.id}`)
                } else {
                    toast.error('Failed to publish: ' + (result.error || 'Unknown error'))
                }
            }
        } catch (error) {
            console.error('Failed to publish:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsPublishing(false)
        }
    }

    const handlePreview = () => {
        // Open blog preview in new tab
        window.open(`/dashboard/preview/${previewData.id}/blog`, '_blank')
    }

    const isPublished = previewData.published || previewData.status === 'published'
    
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 max-w-8xl">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="block md:hidden" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-[300px]">{previewData.title}</h1>
                                <Badge variant={isPublished ? "default" : "outline"} className={isPublished ? "bg-green-500 text-white" : "text-xs"}>
                                    {isPublished ? 'Published' : 'Draft'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground hidden md:block">
                                {isPublished ? 'Your course is live and accessible to users' : 'Preview and edit your generated page'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePreview}
                            className="hover:bg-muted py-2 rounded-xl"
                            size="lg"
                        >
                            <Eye className="h-4 w-4 sm:mr-2" />
                            <span className="hidden md:inline text-sm">Preview</span>
                        </Button>

                        {isPublished && (
                            <Link href={`/${previewData.id}`} target="_blank">
                                <Button variant="outline" className="hover:bg-muted py-2 rounded-xl" size="lg">
                                    <ExternalLink className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden md:inline text-sm">View Live</span>
                                </Button>
                            </Link>
                        )}
                        
                        <Button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            size="lg"
                            className={`group relative ${
                                isPublished 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-black text-white hover:bg-gray-800'
                            } rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                        >
                            <div className={`absolute inset-0 ${
                                isPublished 
                                    ? 'bg-gradient-to-r from-red-700 to-red-600'
                                    : 'bg-gradient-to-r from-gray-800 to-black'
                            } opacity-0 group-hover:opacity-100 transition-opacity`} />
                            {isPublished ? (
                                <X className="h-4 w-4 relative sm:mr-2" />
                            ) : (
                                <Check className="h-4 w-4 relative sm:mr-2" />
                            )}
                            <span className='relative text-white hidden md:inline text-sm'>
                                {isPublished ? 'Unpublish' : 'Publish'}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNav