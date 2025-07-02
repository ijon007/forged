'use client'

import { Badge } from '@/components/ui/badge'
import { Clock, FileText } from 'lucide-react'
import Socials from './socials'
import type { CourseLink } from '@/db/schemas/course-schema'
import { ContentEditor } from './content-editor'

interface BlogPreviewProps {
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

const BlogPreview = ({ previewData }: BlogPreviewProps) => {
    const { title, generatedContent, author, readTime, description, imageUrl, links } = previewData
    const displayAuthor = author || "John Doe"
    const displayReadTime = readTime || "5 min read"
    const price = previewData.price || 29.99
    const displayDescription = description || "AI-generated blog post content"

    return (
        <article className="w-full max-w-6xl mx-auto bg-white rounded-xl border">
            <header className="px-6 py-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-green-600" />
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                        Blog Post
                    </Badge>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {displayDescription}
                    </p>
                </div>
                
                <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">By {displayAuthor}</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{displayReadTime}</span>
                    </div>
                </div>
            </header>

            {imageUrl ? (
                <div className="px-6 py-6">
                    <img 
                        src={imageUrl} 
                        alt={title}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                </div>
            ) : (
                <div className="px-6 py-6">
                    <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Hero Image Placeholder
                    </div>
                </div>
            )}

            <div className="px-6 pb-8">
                <ContentEditor 
                    initialContent={generatedContent}
                    contentType="blog"
                    onContentChange={(newContent) => {
                        // Handle content changes here if needed
                        console.log('Content updated:', newContent)
                    }}
                />

                {links && links.length > 0 && (
                    <div className="mt-8">
                        <Socials initialLinks={links} readOnly={true} />
                    </div>
                )}
            </div>
        </article>
    )
}

export default BlogPreview