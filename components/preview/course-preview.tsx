'use client'

/* React */
import { useState } from 'react'

/* Components */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, GraduationCap, BookOpen, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import QuizSection from './quiz-section'
import { ContentEditor } from './content-editor'
import { toast } from 'sonner'

/* Actions */
import { updateCourse } from '@/actions/course-db-actions'

/* Types */
import type { CourseLink, Lesson } from '@/db/schemas/course-schema'

interface CoursePreviewProps {
    previewData: {
        id: string
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
    
    const lessons = Array.isArray(previewData.generatedContent) ? previewData.generatedContent : []
    
    // State to track content changes for each lesson
    const [lessonContents, setLessonContents] = useState<Record<number, string>>(() => {
        const initialContents: Record<number, string> = {}
        lessons.forEach((lesson, index) => {
            initialContents[index] = lesson.content
        })
        return initialContents
    })

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
    }

    const handleCheckAnswer = (lessonIndex: number) => {
        setShowQuizResults(prev => ({ ...prev, [lessonIndex]: true }))
    }

    const handleLessonContentChange = async (lessonIndex: number, newContent: string) => {
        setLessonContents(prev => ({ ...prev, [lessonIndex]: newContent }))
        
        const updatedLessons = [...lessons]
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], content: newContent }
        
        try {
            const result = await updateCourse({
                id: previewData.id,
                content: updatedLessons
            })
            
            if (result.success) {
                toast.success('Lesson content saved successfully')
            } else {
                toast.error(result.error || 'Failed to save lesson content')
            }
        } catch (error) {
            console.error('Error saving lesson content:', error)
            toast.error('Failed to save lesson content')
        }
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
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-purple-500" />
                    <Badge variant="outline" className="font-medium text-purple-700 border-purple-500 bg-purple-50">Course</Badge>
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
                <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Course Lessons</h3>
                        <Badge variant="secondary">{lessons.length} lessons</Badge>
                    </div>
                    <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                            <div
                                key={index}
                                className={`
                                    p-3 rounded-lg border cursor-pointer transition-colors
                                    ${selectedLesson === index 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border hover:bg-muted/50'
                                    }
                                `}
                                onClick={() => setSelectedLesson(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`
                                        w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
                                        ${selectedLesson === index 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                        }
                                    `}>
                                        {index + 1}
                                    </span>
                                    <span className="font-medium">{lesson.title}</span>
                                    {showQuizResults[index] && (
                                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="text-sm bg-primary text-primary-foreground rounded px-2 py-1">
                                Lesson {selectedLesson + 1}
                            </span>
                            {lessons[selectedLesson].title}
                        </h2>
                        
                        <ContentEditor 
                            initialContent={lessonContents[selectedLesson] || lessons[selectedLesson].content}
                            contentType="course"
                            onContentChange={(newContent) => handleLessonContentChange(selectedLesson, newContent)}
                        />
                    </div>

                    {lessons[selectedLesson].quiz && (
                        <QuizSection
                            lesson={lessons[selectedLesson]}
                            selectedLesson={selectedLesson}
                            quizAnswers={quizAnswers}
                            showQuizResults={showQuizResults}
                            getQuizFeedback={getQuizFeedback}
                            handleQuizAnswer={handleQuizAnswer}
                            handleCheckAnswer={handleCheckAnswer}
                        />
                    )}
                </div>

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