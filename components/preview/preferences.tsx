"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, AlertCircle, Copy, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateCourse } from '@/actions/course-db-actions'
import { useRouter } from 'next/navigation'
import { ImageSelector } from './image-selector'

interface PreferencesProps {
    previewData: {
        id: string
        title: string
        price: number
        description: string
        slug: string
        published?: boolean
        status?: string
        [key: string]: any // Allow additional properties
    }
}

const Preferences = ({ previewData }: PreferencesProps) => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: previewData.title,
        price: previewData.price,
        description: previewData.description,
        slug: previewData.slug
    })
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

    // Track if there are unsaved changes
    useEffect(() => {
        const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify({
            title: previewData.title,
            price: previewData.price,
            description: previewData.description,
            slug: previewData.slug
        })
        setHasChanges(hasUnsavedChanges)
    }, [formData, previewData])

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        if (!hasChanges) {
            toast.info('No changes to save')
            return
        }

        setIsSaving(true)
        try {
            const result = await updateCourse({
                id: previewData.id,
                title: formData.title,
                description: formData.description,
                price: formData.price
            })

            if (result.success) {
                setLastSaved(new Date())
                setHasChanges(false)
                toast.success('Changes saved successfully!')
                
                // Refresh the page data without full reload
                router.refresh()
            } else {
                toast.error('Failed to save changes: ' + (result.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Failed to save changes')
        } finally {
            setIsSaving(false)
        }
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
        navigator.clipboard.writeText(`tryforged.vercel.app/${formData.slug}`)
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
                    {lastSaved && !hasChanges && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Saved {lastSaved.toLocaleTimeString()}
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

                {/* Image Selector */}
                <ImageSelector
                    title={formData.title}
                    courseId={previewData.id}
                    currentImageUrl={previewData.imageUrl}
                    onImageChange={() => router.refresh()}
                />
                
                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">tryforged.me/</span>
                        <div className="flex-1 relative">
                            <Input 
                                id="slug" 
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                className="text-sm pr-8"
                                placeholder="url-slug"
                                disabled
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
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {hasChanges && (
                                <>
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                    <span>You have unsaved changes</span>
                                </>
                            )}
                        </div>
                        <Button 
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                            size="sm"
                            className="min-w-[100px]"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Preferences