'use client'

import { Badge } from '@/components/ui/badge'
import { Clock, ListOrdered } from 'lucide-react'
import type { CourseLink } from '@/db/schemas/course-schema'
import { ContentEditor } from './content-editor'

interface ListiclePreviewProps {
    previewData: {
        title: string
        generatedContent: string
        author?: string
        readTime?: string
        description?: string
        imageUrl?: string
        links?: CourseLink[]
        [key: string]: any
    }
}

export default function ListiclePreview({ previewData }: ListiclePreviewProps) {
    const { title, generatedContent, author, readTime, description, imageUrl } = previewData

    return (
        <article className="w-full max-w-6xl mx-auto bg-white rounded-xl border">
            <header className="px-6 py-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <ListOrdered className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                        Listicle
                    </Badge>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                
                <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                    {author && (
                        <span className="font-medium">By {author}</span>
                    )}
                    {readTime && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{readTime}</span>
                        </div>
                    )}
                </div>
            </header>

            {imageUrl && (
                <div className="px-6 py-6">
                    <img 
                        src={imageUrl} 
                        alt={title}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                </div>
            )}

            <div className="px-6 pb-8">
                <ContentEditor 
                    initialContent={generatedContent}
                    contentType="listicle"
                    onContentChange={(newContent) => {
                        // Handle content changes here if needed
                        console.log('Listicle content updated:', newContent)
                    }}
                />
            </div>
        </article>
    )
} 