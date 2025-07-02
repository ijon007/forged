"use client"

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Trophy,
  BookOpen,
  Clock,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Quiz {
  question: string
  options: string[]
  correctAnswer: number
}

interface Lesson {
  title: string
  content: string
  quiz: Quiz
}

interface PublicCoursePlayerProps {
  lessons: Lesson[]
  courseTitle: string
}

interface LessonProgress {
  completed: boolean
  quizAnswered: boolean
  correctAnswer: boolean
}

const PublicCoursePlayer: React.FC<PublicCoursePlayerProps> = ({ lessons, courseTitle }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [progress, setProgress] = useState<LessonProgress[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  
  // Storage key for this specific course
  const storageKey = `course-progress-${courseTitle.replace(/\s+/g, '-').toLowerCase()}`
  
  // Initialize progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        if (Array.isArray(parsed) && parsed.length === lessons.length) {
          setProgress(parsed)
          return
        }
      } catch (error) {
        console.error('Failed to parse saved progress:', error)
      }
    }
    
    // Initialize new progress
    setProgress(lessons.map(() => ({ 
      completed: false, 
      quizAnswered: false, 
      correctAnswer: false 
    })))
  }, [lessons.length, storageKey])
  
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress.length === lessons.length) {
      localStorage.setItem(storageKey, JSON.stringify(progress))
    }
  }, [progress, storageKey, lessons.length])
  
  // Check if course is completed
  const isCompleted = progress.every(p => p.completed && p.quizAnswered)
  const completedLessons = progress.filter(p => p.completed && p.quizAnswered).length
  const correctAnswers = progress.filter(p => p.correctAnswer).length
  const completionPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0
  
  const currentLesson = lessons[currentLessonIndex]
  const currentProgress = progress[currentLessonIndex] || { completed: false, quizAnswered: false, correctAnswer: false }
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return
    setSelectedAnswer(answerIndex)
  }
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    setShowAnswer(true)
    const isCorrect = selectedAnswer === currentLesson.quiz.correctAnswer
    
    // Update progress
    const newProgress = [...progress]
    newProgress[currentLessonIndex] = {
      ...newProgress[currentLessonIndex],
      quizAnswered: true,
      correctAnswer: isCorrect
    }
    setProgress(newProgress)
  }
  
  const handleNextLesson = () => {
    // Mark current lesson as completed
    const newProgress = [...progress]
    newProgress[currentLessonIndex] = {
      ...newProgress[currentLessonIndex],
      completed: true
    }
    setProgress(newProgress)
    
    // Check if this was the last lesson and course is now complete
    const updatedCompletedLessons = newProgress.filter(p => p.completed && p.quizAnswered).length
    if (currentLessonIndex === lessons.length - 1 && updatedCompletedLessons === lessons.length) {
      setShowCompletionDialog(true)
      return
    }
    
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }
  
  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    }
  }
  
  const handleLessonSelect = (index: number) => {
    setCurrentLessonIndex(index)
    setSelectedAnswer(null)
    setShowAnswer(false)
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Lesson Sidebar */}
      <div className="lg:w-80 lg:flex-shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{completedLessons} of {lessons.length} lessons</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {lessons.map((lesson, index) => {
              const lessonProgress = progress[index] || { completed: false, quizAnswered: false, correctAnswer: false }
              const isActive = index === currentLessonIndex
              const isCompleted = lessonProgress.completed && lessonProgress.quizAnswered
              
              return (
                <div
                  key={index}
                  onClick={() => handleLessonSelect(index)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50",
                    isCompleted && "bg-green-50 border border-green-200"
                  )}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      Lesson {index + 1}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {lesson.title}
                    </div>
                  </div>
                  {lessonProgress.quizAnswered && (
                    <Badge variant={lessonProgress.correctAnswer ? "default" : "secondary"}>
                      {lessonProgress.correctAnswer ? "✓" : "✗"}
                    </Badge>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Lesson Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lesson {currentLessonIndex + 1}</h1>
            <h2 className="text-xl text-muted-foreground mt-1">{currentLesson.title}</h2>
          </div>
          <Badge variant="outline">
            {currentLessonIndex + 1} of {lessons.length}
          </Badge>
        </div>

        {/* Lesson Content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : ''
                    const isInline = !className?.includes('language-')
                    
                    if (isInline) {
                        return (
                            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        )
                    }
                    
                    return (
                        <div className="my-4 overflow-x-auto">
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={language || 'text'}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.5rem',
                                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                    overflowX: 'auto'
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    )
                },
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-3 leading-6 text-gray-700 dark:text-gray-300">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 pl-6 space-y-2 list-disc list-outside">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 pl-6 space-y-2 list-decimal list-outside">{children}</ol>,
                li: ({ children }) => <li className="leading-6 text-gray-700 dark:text-gray-300">{children}</li>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-600 dark:text-gray-400 mb-3">
                        {children}
                    </blockquote>
                ),
                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                }}
              >
                {currentLesson.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Lesson Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">{currentLesson.quiz.question}</p>
            
            <div className="space-y-2">
              {currentLesson.quiz.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === currentLesson.quiz.correctAnswer
                const showCorrectAnswer = showAnswer && isCorrect
                const showIncorrectAnswer = showAnswer && isSelected && !isCorrect
                
                return (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      isSelected && !showAnswer && "border-blue-500 bg-blue-50",
                      showCorrectAnswer && "border-green-500 bg-green-50",
                      showIncorrectAnswer && "border-red-500 bg-red-50",
                      !isSelected && !showAnswer && "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        isSelected && !showAnswer && "border-blue-500 bg-blue-500",
                        showCorrectAnswer && "border-green-500 bg-green-500",
                        showIncorrectAnswer && "border-red-500 bg-red-500",
                        !isSelected && !showAnswer && "border-gray-300"
                      )}>
                        {(isSelected || showCorrectAnswer) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showCorrectAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {!showAnswer && selectedAnswer !== null && (
              <Button onClick={handleSubmitAnswer} className="w-full">
                Submit Answer
              </Button>
            )}

            {showAnswer && (
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-lg",
                  selectedAnswer === currentLesson.quiz.correctAnswer 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                )}>
                  <p className="font-medium">
                    {selectedAnswer === currentLesson.quiz.correctAnswer 
                      ? "🎉 Correct! Well done." 
                      : "❌ Incorrect. The correct answer is highlighted above."
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Lesson
          </Button>

          {showAnswer && (
            <Button
              onClick={handleNextLesson}
              className="flex items-center gap-2"
            >
              {currentLessonIndex === lessons.length - 1 ? 'Complete Course' : 'Next Lesson'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Course Completed!
            </DialogTitle>
            <DialogDescription>
              Congratulations! You've successfully completed {courseTitle}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">🎓</div>
              <div className="space-y-1">
                <div className="text-lg font-semibold">Final Score</div>
                <div className={cn("text-2xl font-bold", getScoreColor((correctAnswers / lessons.length) * 100))}>
                  {Math.round((correctAnswers / lessons.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {correctAnswers} out of {lessons.length} questions correct
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Completed</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowCompletionDialog(false)} 
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicCoursePlayer 