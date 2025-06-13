"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Check } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface TopNavProps {
    previewData: {
        title: string
        status: string
        slug: string
    }
}

const TopNav = ({ previewData }: TopNavProps) => {

    const handlePublish = () => {
        redirect(`/${previewData.slug}`)
    }
    
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold">{previewData.title}</h1>
                            <p className="text-sm text-muted-foreground">Preview your generated page</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">Draft</Badge>
                        <Button size="sm" onClick={handlePublish}>
                            <Check className="mr-2 h-4 w-4" />
                            Publish Page
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNav