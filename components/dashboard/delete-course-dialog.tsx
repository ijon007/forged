"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCourse } from "@/actions/course-db-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteCourseDialogProps {
  courseId: string;
  courseTitle: string;
  children: React.ReactNode;
}

export function DeleteCourseDialog({
  courseId,
  courseTitle,
  children,
}: DeleteCourseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteCourse(courseId);

      if (result.success) {
        toast.success("Course deleted successfully");
        setIsOpen(false);
        // Refresh the page to update the course list
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Delete Course
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{courseTitle}"</span>?
            <br />
            <br />
            This action cannot be undone. The course and all its data will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            className="rounded-xl px-10 py-5"
            disabled={isDeleting}
            onClick={() => setIsOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-red-600 px-10 py-5 text-white hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
