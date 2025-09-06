"use client";

import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Target,
  Trophy,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Lesson {
  title: string;
  content: string;
  quiz: Quiz;
}

interface PublicCoursePlayerProps {
  lessons: Lesson[];
  courseTitle: string;
}

interface LessonProgress {
  completed: boolean;
  quizAnswered: boolean;
  correctAnswer: boolean;
}

const PublicCoursePlayer: React.FC<PublicCoursePlayerProps> = ({
  lessons,
  courseTitle,
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Storage key for this specific course
  const storageKey = `course-progress-${courseTitle.replace(/\s+/g, "-").toLowerCase()}`;

  // Initialize progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed) && parsed.length === lessons.length) {
          setProgress(parsed);
          return;
        }
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    }

    // Initialize new progress
    setProgress(
      lessons.map(() => ({
        completed: false,
        quizAnswered: false,
        correctAnswer: false,
      }))
    );
  }, [lessons.length, storageKey]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress.length === lessons.length) {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, storageKey, lessons.length]);

  // Check if course is completed
  const isCompleted = progress.every((p) => p.completed && p.quizAnswered);
  const completedLessons = progress.filter(
    (p) => p.completed && p.quizAnswered
  ).length;
  const correctAnswers = progress.filter((p) => p.correctAnswer).length;
  const completionPercentage =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : 0;

  const currentLesson = lessons[currentLessonIndex];
  const currentProgress = progress[currentLessonIndex] || {
    completed: false,
    quizAnswered: false,
    correctAnswer: false,
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowAnswer(true);
    const isCorrect = selectedAnswer === currentLesson.quiz.correctAnswer;

    // Update progress
    const newProgress = [...progress];
    newProgress[currentLessonIndex] = {
      ...newProgress[currentLessonIndex],
      quizAnswered: true,
      correctAnswer: isCorrect,
    };
    setProgress(newProgress);
  };

  const handleNextLesson = () => {
    // Mark current lesson as completed
    const newProgress = [...progress];
    newProgress[currentLessonIndex] = {
      ...newProgress[currentLessonIndex],
      completed: true,
    };
    setProgress(newProgress);

    // Check if this was the last lesson and course is now complete
    const updatedCompletedLessons = newProgress.filter(
      (p) => p.completed && p.quizAnswered
    ).length;
    if (
      currentLessonIndex === lessons.length - 1 &&
      updatedCompletedLessons === lessons.length
    ) {
      setShowCompletionDialog(true);
      return;
    }

    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLessonIndex(index);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Lesson Sidebar */}
      <div className="lg:w-80 lg:flex-shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <BookOpen className="h-4 w-4" />
              <span>
                {completedLessons} of {lessons.length} lessons
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {lessons.map((lesson, index) => {
              const lessonProgress = progress[index] || {
                completed: false,
                quizAnswered: false,
                correctAnswer: false,
              };
              const isActive = index === currentLessonIndex;
              const isCompleted =
                lessonProgress.completed && lessonProgress.quizAnswered;

              return (
                <div
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
                    isActive
                      ? "border border-blue-200 bg-blue-50"
                      : "hover:bg-gray-50",
                    isCompleted && "border border-green-200 bg-green-50"
                  )}
                  key={index}
                  onClick={() => handleLessonSelect(index)}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-sm">
                      Lesson {index + 1}
                    </div>
                    <div className="truncate text-muted-foreground text-xs">
                      {lesson.title}
                    </div>
                  </div>
                  {lessonProgress.quizAnswered && (
                    <Badge
                      variant={
                        lessonProgress.correctAnswer ? "default" : "secondary"
                      }
                    >
                      {lessonProgress.correctAnswer ? "✓" : "✗"}
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Lesson Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl">
              Lesson {currentLessonIndex + 1}
            </h1>
            <h2 className="mt-1 text-muted-foreground text-xl">
              {currentLesson.title}
            </h2>
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
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    const isInline = !className?.includes("language-");

                    if (isInline) {
                      return (
                        <code
                          className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    return (
                      <div className="my-4 overflow-x-auto">
                        <SyntaxHighlighter
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.5rem",
                            fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                            overflowX: "auto",
                          }}
                          language={language || "text"}
                          PreTag="div"
                          style={vscDarkPlus}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="mt-6 mb-3 font-bold text-2xl first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-6 mb-3 font-semibold text-xl">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-4 mb-2 font-medium text-lg">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-gray-700 leading-6 dark:text-gray-300">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-outside list-disc space-y-2 pl-6">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-outside list-decimal space-y-2 pl-6">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 leading-6 dark:text-gray-300">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="mb-3 border-gray-300 border-l-4 pl-3 text-gray-600 italic dark:border-gray-600 dark:text-gray-400">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      {children}
                    </strong>
                  ),
                }}
                remarkPlugins={[remarkGfm]}
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
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentLesson.quiz.correctAnswer;
                const showCorrectAnswer = showAnswer && isCorrect;
                const showIncorrectAnswer =
                  showAnswer && isSelected && !isCorrect;

                return (
                  <div
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-colors",
                      isSelected && !showAnswer && "border-blue-500 bg-blue-50",
                      showCorrectAnswer && "border-green-500 bg-green-50",
                      showIncorrectAnswer && "border-red-500 bg-red-50",
                      !(isSelected || showAnswer) && "hover:bg-gray-50"
                    )}
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border-2",
                          isSelected &&
                            !showAnswer &&
                            "border-blue-500 bg-blue-500",
                          showCorrectAnswer && "border-green-500 bg-green-500",
                          showIncorrectAnswer && "border-red-500 bg-red-500",
                          !(isSelected || showAnswer) && "border-gray-300"
                        )}
                      >
                        {(isSelected || showCorrectAnswer) && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showCorrectAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showAnswer && selectedAnswer !== null && (
              <Button className="w-full" onClick={handleSubmitAnswer}>
                Submit Answer
              </Button>
            )}

            {showAnswer && (
              <div className="space-y-4">
                <div
                  className={cn(
                    "rounded-lg p-4",
                    selectedAnswer === currentLesson.quiz.correctAnswer
                      ? "border border-green-200 bg-green-50"
                      : "border border-red-200 bg-red-50"
                  )}
                >
                  <p className="font-medium">
                    {selectedAnswer === currentLesson.quiz.correctAnswer
                      ? "🎉 Correct! Well done."
                      : "❌ Incorrect. The correct answer is highlighted above."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            className="flex items-center gap-2"
            disabled={currentLessonIndex === 0}
            onClick={handlePreviousLesson}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Lesson
          </Button>

          {showAnswer && (
            <Button
              className="flex items-center gap-2"
              onClick={handleNextLesson}
            >
              {currentLessonIndex === lessons.length - 1
                ? "Complete Course"
                : "Next Lesson"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Completion Dialog */}
      <Dialog
        onOpenChange={setShowCompletionDialog}
        open={showCompletionDialog}
      >
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
            <div className="space-y-2 text-center">
              <div className="font-bold text-3xl">🎓</div>
              <div className="space-y-1">
                <div className="font-semibold text-lg">Final Score</div>
                <div
                  className={cn(
                    "font-bold text-2xl",
                    getScoreColor((correctAnswers / lessons.length) * 100)
                  )}
                >
                  {Math.round((correctAnswers / lessons.length) * 100)}%
                </div>
                <div className="text-muted-foreground text-sm">
                  {correctAnswers} out of {lessons.length} questions correct
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
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
              className="w-full"
              onClick={() => setShowCompletionDialog(false)}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicCoursePlayer;
