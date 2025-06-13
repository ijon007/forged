import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface PreferencesProps {
    previewData: {
        title: string
        price: number
        description: string
        slug: string
    }
}

const Preferences = ({ previewData }: PreferencesProps) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Page Settings</CardTitle>
                <CardDescription>
                    Customize your page details before publishing
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            id="title" 
                            defaultValue={previewData.title}
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input 
                            id="price" 
                            type="number" 
                            defaultValue={previewData.price}
                            className="text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            id="description" 
                            defaultValue={previewData.description}
                            className="text-sm"
                            rows={2}
                        />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">knowledgesmith.com/</span>
                        <Input 
                            id="slug" 
                            defaultValue={previewData.slug}
                            className="text-sm"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Preferences