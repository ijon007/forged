import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/db/schemas/course-schema";

type QuizSectionProps = {
  lesson: Lesson;
  selectedLesson: number;
  quizAnswers: Record<number, number>;
  showQuizResults: Record<number, boolean>;
  getQuizFeedback: (lessonIndex: number) => {
    isCorrect: boolean;
    message: string;
  };
  handleQuizAnswer: (lessonIndex: number, optionIndex: number) => void;
  handleCheckAnswer: (lessonIndex: number) => void;
};

const QuizSection = ({
  lesson,
  selectedLesson,
  quizAnswers,
  showQuizResults,
  getQuizFeedback,
  handleQuizAnswer,
  handleCheckAnswer,
}: QuizSectionProps) => {
  return (
    <div className="rounded-2xl border bg-muted/30 p-6">
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Knowledge Check</h3>
      </div>

      <div className="space-y-4">
        <p className="font-medium">{lesson.quiz.question}</p>

        <div className="grid gap-2">
          {lesson.quiz.options.map((option, optionIndex) => {
            const isSelected = quizAnswers[selectedLesson] === optionIndex;
            const isCorrect = optionIndex === lesson.quiz.correctAnswer;
            const showResults = showQuizResults[selectedLesson];

            let buttonVariant: "outline" | "default" | "destructive" =
              "outline";

            if (showResults) {
              if (isCorrect) {
                buttonVariant = "default";
              } else if (isSelected && !isCorrect) {
                buttonVariant = "destructive";
              }
            } else if (isSelected) {
              buttonVariant = "default";
            }

            return (
              <Button
                className="h-auto justify-start whitespace-normal p-3 text-left"
                disabled={showQuizResults[selectedLesson]}
                key={optionIndex}
                onClick={() => handleQuizAnswer(selectedLesson, optionIndex)}
                variant={buttonVariant}
              >
                <span className="mr-3 rounded bg-background/20 px-2 py-1 text-xs">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                {option}
              </Button>
            );
          })}
        </div>

        {quizAnswers[selectedLesson] !== undefined &&
          !showQuizResults[selectedLesson] && (
            <Button
              className="w-full rounded-xl"
              onClick={() => handleCheckAnswer(selectedLesson)}
            >
              Check Answer
            </Button>
          )}

        {showQuizResults[selectedLesson] && (
          <div
            className={`rounded-lg p-3 ${
              getQuizFeedback(selectedLesson).isCorrect
                ? "border border-green-200 bg-green-50 text-green-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <p className="font-medium text-sm">
              {getQuizFeedback(selectedLesson).message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default QuizSection;
