import {
  AlertTriangle,
  Check,
  CircleCheckBig,
  EyeOff,
  Globe,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface PublishDialogProps {
  isPublished: boolean;
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
  courseTitle?: string;
}

const PublishDialog = ({
  isPublished,
  isLoading = false,
  onConfirm,
  children,
  courseTitle,
}: PublishDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-3xl border-0 bg-white/95 shadow-2xl backdrop-blur-sm sm:max-w-[520px]">
        <div className="py-6">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div
                className={`rounded-full p-3 ${
                  isPublished
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {isPublished ? (
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Globe className="h-6 w-6" />
                )}
              </div>
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="font-bold text-2xl">
                {isPublished ? "Unpublish Course" : "Publish Course"}
              </DialogTitle>
              <p className="text-base text-muted-foreground">
                {isPublished
                  ? "Hide your course from public view"
                  : "Make your course publicly available"}
              </p>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="truncate font-medium text-slate-900">
                  {courseTitle}
                </p>
              </div>
            </div>

            {isPublished ? (
              <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-red-100 p-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-900">
                      This will hide your course
                    </h4>
                    <ul className="space-y-1 text-red-700 text-sm">
                      <li>• Users won't be able to access your course</li>
                      <li>• All shared links will stop working</li>
                      <li>• You can republish anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-green-100 p-2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-900">
                      Your course will go live
                    </h4>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• Available to all users instantly</li>
                      <li>• You'll be redirected to the live version</li>
                      <li>• Share the link with your audience</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex w-full justify-center gap-4">
            <Button
              className={`${
                isPublished
                  ? "mt-5 w-full rounded-3xl bg-red-600 py-1 text-white hover:bg-red-700"
                  : "mt-5 w-full rounded-3xl bg-green-600 py-1 text-white hover:bg-green-700"
              }`}
              disabled={isProcessing || isLoading}
              onClick={handleConfirm}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                  {isPublished ? "Unpublishing..." : "Publishing..."}
                </>
              ) : (
                <>
                  {isPublished ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <CircleCheckBig className="mr-2 h-4 w-4" />
                      Publish
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
