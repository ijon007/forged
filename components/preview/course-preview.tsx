'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, GraduationCap, BookOpen, HelpCircle, CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { CourseLink, Lesson } from '@/db/schemas/course-schema'

interface CoursePreviewProps {
    previewData: {
        title: string
        generatedContent: Lesson[]
        author?: string
        estimatedReadTime?: number
        description?: string
        imageUrl?: string
        links?: CourseLink[]
        [key: string]: any
    }
}

export default function CoursePreview({ previewData }: CoursePreviewProps) {
    const [selectedLesson, setSelectedLesson] = useState(0)
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
    const [showQuizResults, setShowQuizResults] = useState<Record<number, boolean>>({})

    // Ensure we have lessons data and it's an array
    const lessons = Array.isArray(previewData.generatedContent) ? previewData.generatedContent : []

    if (lessons.length === 0) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No course lessons available.</p>
                </CardContent>
            </Card>
        )
    }

    const handleQuizAnswer = (lessonIndex: number, optionIndex: number) => {
        setQuizAnswers(prev => ({ ...prev, [lessonIndex]: optionIndex }))
        setShowQuizResults(prev => ({ ...prev, [lessonIndex]: true }))
    }

    const getQuizFeedback = (lessonIndex: number) => {
        const lesson = lessons[lessonIndex]
        const selectedAnswer = quizAnswers[lessonIndex]
        const isCorrect = selectedAnswer === lesson.quiz.correctAnswer
        
        return {
            isCorrect,
            message: isCorrect 
                ? "Correct! You've mastered this concept." 
                : `Incorrect. The correct answer is: ${lesson.quiz.options[lesson.quiz.correctAnswer]}`
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <Badge variant="outline" className="font-medium">Course</Badge>
                </div>
                <div>
                    <CardTitle className="text-2xl mb-2">{previewData.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                        {previewData.description}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {previewData.author && (
                        <span>By {previewData.author}</span>
                    )}
                    {previewData.estimatedReadTime && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{previewData.estimatedReadTime} min course</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{lessons.length} lessons</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Course Navigation */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Course Lessons</h3>
                    <div className="grid gap-2">
                        {lessons.map((lesson, index) => (
                            <Button
                                key={index}
                                variant={selectedLesson === index ? "default" : "ghost"}
                                className="justify-start h-auto p-3"
                                onClick={() => setSelectedLesson(index)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <span className="text-xs bg-muted rounded px-2 py-1">
                                        {index + 1}
                                    </span>
                                    <span className="text-left">{lesson.title}</span>
                                    {showQuizResults[index] && (
                                        <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                                    )}
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Current Lesson Content */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="text-sm bg-primary text-primary-foreground rounded px-2 py-1">
                                Lesson {selectedLesson + 1}
                            </span>
                            {lessons[selectedLesson].title}
                        </h2>
                        
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const inline = !match
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={vscDarkPlus as any}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            >
                                {lessons[selectedLesson].content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <Separator />

                    {/* Quiz Section */}
                    {lessons[selectedLesson].quiz && (
                        <div className="border rounded-lg p-6 bg-muted/30">
                            <div className="flex items-center gap-2 mb-4">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">Knowledge Check</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <p className="font-medium">{lessons[selectedLesson].quiz.question}</p>
                                
                                <div className="grid gap-2">
                                    {lessons[selectedLesson].quiz.options.map((option, optionIndex) => {
                                        const isSelected = quizAnswers[selectedLesson] === optionIndex
                                        const isCorrect = optionIndex === lessons[selectedLesson].quiz.correctAnswer
                                        const showResults = showQuizResults[selectedLesson]
                                        
                                        let buttonVariant: "outline" | "default" | "destructive" = "outline"
                                        
                                        if (showResults) {
                                            if (isCorrect) {
                                                buttonVariant = "default"
                                            } else if (isSelected && !isCorrect) {
                                                buttonVariant = "destructive"
                                            }
                                        }
                                        
                                        return (
                                            <Button
                                                key={optionIndex}
                                                variant={buttonVariant}
                                                className="justify-start h-auto p-3 text-left whitespace-normal"
                                                onClick={() => handleQuizAnswer(selectedLesson, optionIndex)}
                                                disabled={showQuizResults[selectedLesson]}
                                            >
                                                <span className="text-xs bg-background/20 rounded px-2 py-1 mr-3">
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </span>
                                                {option}
                                            </Button>
                                        )
                                    })}
                                </div>
                                
                                {showQuizResults[selectedLesson] && (
                                    <div className={`p-3 rounded-lg ${
                                        getQuizFeedback(selectedLesson).isCorrect 
                                            ? 'bg-green-50 text-green-800 border border-green-200' 
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                        <p className="text-sm font-medium">
                                            {getQuizFeedback(selectedLesson).message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setSelectedLesson(Math.max(0, selectedLesson - 1))}
                        disabled={selectedLesson === 0}
                    >
                        Previous Lesson
                    </Button>
                    
                    <Button
                        onClick={() => setSelectedLesson(Math.min(lessons.length - 1, selectedLesson + 1))}
                        disabled={selectedLesson === lessons.length - 1}
                    >
                        Next Lesson
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 