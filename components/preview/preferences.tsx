"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface PreferencesProps {
    previewData: {
        title: string
        price: number
        description: string
        slug: string
    }
}

const Preferences = ({ previewData }: PreferencesProps) => {
    const [formData, setFormData] = useState({
        title: previewData.title,
        price: previewData.price,
        description: previewData.description,
        slug: previewData.slug
    })
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // Auto-save functionality
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (JSON.stringify(formData) !== JSON.stringify(previewData)) {
                setIsAutoSaving(true)
                // Simulate auto-save
                await new Promise(resolve => setTimeout(resolve, 500))
                setIsAutoSaving(false)
                setLastSaved(new Date())
            }
        }, 2000)

        return () => clearTimeout(timeoutId)
    }, [formData, previewData])

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        
        setFormData(prev => ({ ...prev, slug }))
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(`knowledgesmith.com/${formData.slug}`)
        toast.success('URL copied to clipboard!')
    }

    return (
        <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Page Settings</CardTitle>
                        <CardDescription>
                            Customize your page details before publishing
                        </CardDescription>
                    </div>
                    {lastSaved && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Auto-saved {lastSaved.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            id="title" 
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="text-sm"
                            placeholder="Enter page title..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input 
                            id="price" 
                            type="number" 
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                            className="text-sm"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                        id="description" 
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="text-sm resize-none"
                        rows={3}
                        placeholder="Write a compelling description..."
                    />
                    <div className="text-xs text-muted-foreground text-right">
                        {formData.description.length}/160 characters
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">knowledgesmith.com/</span>
                        <div className="flex-1 relative">
                            <Input 
                                id="slug" 
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                className="text-sm pr-8"
                                placeholder="url-slug"
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={generateSlug}
                            className="whitespace-nowrap"
                        >
                            Auto-generate
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" onClick={copyUrl} className="text-xs h-6 px-2">
                            <Copy className="mr-1 h-3 w-3" />
                            Copy URL
                        </Button>
                        {isAutoSaving && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                                Saving...
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Preferences