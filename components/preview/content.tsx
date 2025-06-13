import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ContentProps {
    previewData: {
        originalContent: string
    }
}

const Content = ({ previewData }: ContentProps) => {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Original PDF Content</CardTitle>
                <CardDescription>
                    Extracted content from your uploaded PDF
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                    {previewData.originalContent}
                    </pre>
                </div>
            </CardContent>
        </Card>
    )
}

export default Content