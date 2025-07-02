import { Button } from "@/components/ui/button"
import { Lesson } from "@/db/schemas/course-schema"
import { HelpCircle } from "lucide-react"

type QuizSectionProps = {
    lesson: Lesson
    selectedLesson: number
    quizAnswers: Record<number, number>
    showQuizResults: Record<number, boolean>
    getQuizFeedback: (lessonIndex: number) => { isCorrect: boolean; message: string }
    handleQuizAnswer: (lessonIndex: number, optionIndex: number) => void
    handleCheckAnswer: (lessonIndex: number) => void
}

const QuizSection = ({
    lesson,
    selectedLesson,
    quizAnswers,
    showQuizResults,
    getQuizFeedback,
    handleQuizAnswer,
    handleCheckAnswer
}: QuizSectionProps) => {
    return (
        <div className="border rounded-2xl p-6 bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Knowledge Check</h3>
            </div>
            
            <div className="space-y-4">
                <p className="font-medium">{lesson.quiz.question}</p>
                
                <div className="grid gap-2">
                    {lesson.quiz.options.map((option, optionIndex) => {
                        const isSelected = quizAnswers[selectedLesson] === optionIndex
                        const isCorrect = optionIndex === lesson.quiz.correctAnswer
                        const showResults = showQuizResults[selectedLesson]
                        
                        let buttonVariant: "outline" | "default" | "destructive" = "outline"
                        
                        if (showResults) {
                            if (isCorrect) {
                                buttonVariant = "default"
                            } else if (isSelected && !isCorrect) {
                                buttonVariant = "destructive"
                            }
                        } else if (isSelected) {
                            buttonVariant = "default"
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
                
                {quizAnswers[selectedLesson] !== undefined && !showQuizResults[selectedLesson] && (
                    <Button 
                        onClick={() => handleCheckAnswer(selectedLesson)}
                        className="w-full rounded-xl"
                    >
                        Check Answer
                    </Button>
                )}
                
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
    )
}
export default QuizSection