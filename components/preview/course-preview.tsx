"use client";

import { BookOpen, CheckCircle, Clock, GraduationCap } from "lucide-react";
/* React */
import { useState } from "react";
import { toast } from "sonner";
/* Actions */
import { updateCourse } from "@/actions/course-db-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
/* Components */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
/* Types */
import type { CourseLink, Lesson } from "@/db/schemas/course-schema";
import { ContentEditor } from "./content-editor";
import PreferencesSheet from "./preferences-sheet";
import QuizSection from "./quiz-section";

interface CoursePreviewProps {
  previewData: {
    id: string;
    title: string;
    generatedContent: Lesson[];
    author?: string;
    estimatedReadTime?: number;
    description?: string;
    imageUrl?: string;
    links?: CourseLink[];
    [key: string]: any;
  };
}

export default function CoursePreview({ previewData }: CoursePreviewProps) {
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<
    Record<number, boolean>
  >({});

  const lessons = Array.isArray(previewData.generatedContent)
    ? previewData.generatedContent
    : [];

  // State to track content changes for each lesson
  const [lessonContents, setLessonContents] = useState<Record<number, string>>(
    () => {
      const initialContents: Record<number, string> = {};
      lessons.forEach((lesson, index) => {
        initialContents[index] = lesson.content;
      });
      return initialContents;
    }
  );

  if (lessons.length === 0) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No course lessons available.</p>
        </CardContent>
      </Card>
    );
  }

  const handleQuizAnswer = (lessonIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [lessonIndex]: optionIndex }));
  };

  const handleCheckAnswer = (lessonIndex: number) => {
    setShowQuizResults((prev) => ({ ...prev, [lessonIndex]: true }));
  };

  const handleLessonContentChange = async (
    lessonIndex: number,
    newContent: string
  ) => {
    setLessonContents((prev) => ({ ...prev, [lessonIndex]: newContent }));

    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      content: newContent,
    };

    try {
      const result = await updateCourse({
        id: previewData.id,
        content: updatedLessons,
      });

      if (result.success) {
        toast.success("Lesson content saved successfully");
      } else {
        toast.error(result.error || "Failed to save lesson content");
      }
    } catch (error) {
      console.error("Error saving lesson content:", error);
      toast.error("Failed to save lesson content");
    }
  };

  const getQuizFeedback = (lessonIndex: number) => {
    const lesson = lessons[lessonIndex];
    const selectedAnswer = quizAnswers[lessonIndex];
    const isCorrect = selectedAnswer === lesson.quiz.correctAnswer;

    return {
      isCorrect,
      message: isCorrect
        ? "Correct! You've mastered this concept."
        : `Incorrect. The correct answer is: ${lesson.quiz.options[lesson.quiz.correctAnswer]}`,
    };
  };

  return (
    <Card className="mx-auto w-full max-w-6xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-purple-500" />
          <Badge
            className="border-purple-500 bg-purple-50 font-medium text-purple-700"
            variant="outline"
          >
            Course
          </Badge>
        </div>
        <div>
          <CardTitle className="mb-2 text-2xl">{previewData.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {previewData.description}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          {previewData.author && <span>By {previewData.author}</span>}
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
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Course Lessons</h3>
            <Badge variant="secondary">{lessons.length} lessons</Badge>
          </div>
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <div
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  selectedLesson === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }
                                `}
                key={index}
                onClick={() => setSelectedLesson(index)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-medium text-sm ${
                      selectedLesson === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }
                                    `}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium">{lesson.title}</span>
                  {showQuizResults[index] && (
                    <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-xl">
              <span className="rounded bg-primary px-2 py-1 text-primary-foreground text-sm">
                Lesson {selectedLesson + 1}
              </span>
              {lessons[selectedLesson].title}
            </h2>

            <ContentEditor
              contentType="course"
              initialContent={
                lessonContents[selectedLesson] ||
                lessons[selectedLesson].content
              }
              onContentChange={(newContent) =>
                handleLessonContentChange(selectedLesson, newContent)
              }
            />
          </div>

          {lessons[selectedLesson].quiz && (
            <QuizSection
              getQuizFeedback={getQuizFeedback}
              handleCheckAnswer={handleCheckAnswer}
              handleQuizAnswer={handleQuizAnswer}
              lesson={lessons[selectedLesson]}
              quizAnswers={quizAnswers}
              selectedLesson={selectedLesson}
              showQuizResults={showQuizResults}
            />
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            disabled={selectedLesson === 0}
            onClick={() => setSelectedLesson(Math.max(0, selectedLesson - 1))}
            variant="outline"
          >
            Previous Lesson
          </Button>

          <Button
            disabled={selectedLesson === lessons.length - 1}
            onClick={() =>
              setSelectedLesson(
                Math.min(lessons.length - 1, selectedLesson + 1)
              )
            }
          >
            Next Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
