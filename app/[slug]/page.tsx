import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Lock, Star, Clock, Users, DollarSign, Eye, Share } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCourse } from "@/actions/course-db-actions"

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Get course from database
  const dbCourse = await getCourse(slug)
  
  // Only show published courses
  if (!dbCourse || !dbCourse.published) {
    notFound()
  }
  
  // Format course data for the page
  const page = {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    price: dbCourse.price / 100, // Convert from cents to dollars
    isPurchased: false, // TODO: This would be determined by user session/payment status
    author: "KnowledgeSmith AI", // Default author for AI-generated content
    readTime: `${dbCourse.estimatedReadTime} min read`,
    views: Math.floor(Math.random() * 1000) + 500, // TODO: Track actual views
    imageUrl: dbCourse.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop", // Use stored image or fallback
    content: dbCourse.content,
    tags: dbCourse.tags,
    keyPoints: dbCourse.keyPoints
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="space-y-4">
            <Badge variant="secondary">Blog Post</Badge>
            <h1 className="text-4xl font-bold leading-tight">{page.title}</h1>
            <p className="text-xl text-muted-foreground">{page.description}</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>By {page.author}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{page.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{page.views.toLocaleString()} views</span>
            </div>
          </div>
          
          <Separator />
        </div>

        {/* Hero Image */}
        {page.imageUrl && (
          <div className="mb-8">
            <img 
              src={page.imageUrl} 
              alt={page.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {page.isPurchased ? (
              // Full Content (for purchased users)
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }: any) {
                      const isInline = !className?.includes('language-')
                      return isInline ? (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm font-mono" {...props}>
                            {children}
                          </code>
                        </pre>
                      )
                    },
                    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>,
                    p: ({ children }) => <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
                    ul: ({ children }) => <ul className="mb-4 space-y-2 list-disc list-inside">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
                    li: ({ children }) => <li className="leading-7">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
                  }}
                >
                  {page.content}
                </ReactMarkdown>
              </div>
            ) : (
              // Preview + Paywall
              <div className="space-y-8">
                {/* Content Preview */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }: any) {
                        const isInline = !className?.includes('language-')
                        return isInline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm font-mono" {...props}>
                              {children}
                            </code>
                          </pre>
                        )
                      },
                      h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>,
                      p: ({ children }) => <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
                      ul: ({ children }) => <ul className="mb-4 space-y-2 list-disc list-inside">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
                      li: ({ children }) => <li className="leading-7">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
                    }}
                  >
                    {page.content.split('\n').slice(0, 15).join('\n')}
                  </ReactMarkdown>
                </div>
                
                {/* Paywall */}
                <Card className="border-dashed border-2 bg-muted/20">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">Continue Reading</CardTitle>
                    <CardDescription className="mb-6 max-w-md">
                      Unlock the full article to continue reading and get access to all the examples and insights.
                    </CardDescription>
                    
                    <div className="space-y-4 w-full max-w-sm">
                      <div className="text-center">
                        <span className="text-3xl font-bold">${page.price}</span>
                        <span className="text-muted-foreground ml-1">one-time</span>
                      </div>
                      
                      <Button size="lg" className="w-full">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Unlock Full Article
                      </Button>
                      
                      <div className="text-xs text-muted-foreground">
                        Instant access • No subscription
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium">{page.author}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read time</span>
                  <span className="font-medium">{page.readTime}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{page.views.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">${page.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Key Points Section */}
            {page.keyPoints && page.keyPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {page.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags Section */}
            {page.tags && page.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {page.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full mb-3">
                  <Share className="mr-2 h-4 w-4" />
                  Share Article
                </Button>
                {!page.isPurchased && (
                  <Button className="w-full">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Buy Now - ${page.price}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 