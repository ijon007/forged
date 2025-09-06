"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AccessCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accessCode: string;
  courseTitle: string;
  onContinue?: () => void;
}

export function AccessCodeDialog({
  isOpen,
  onClose,
  accessCode,
  courseTitle,
  onContinue,
}: AccessCodeDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🎉 Purchase Complete!</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            You now have access to <strong>{courseTitle}</strong>
          </p>

          <div className="rounded-lg bg-muted p-4">
            <p className="mb-2 font-medium text-sm">Your Access Code:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-xl border bg-background p-2 font-bold font-mono text-lg">
                {accessCode}
              </code>
              <Button onClick={handleCopy} size="sm">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Save this code! You'll need it to
              access this course from anywhere.
            </p>
          </div>

          <Button className="w-full rounded-lg" onClick={handleContinue}>
            Continue to Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AccessCodeInputDialogProps {
  isOpen: boolean;
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: string;
  onClose: () => void;
}

export function AccessCodeInputDialog({
  isOpen,
  onSubmit,
  isLoading,
  error,
  onClose,
}: AccessCodeInputDialogProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Access Code</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-muted-foreground text-sm">
            Please enter your access code to continue
          </p>

          <div className="space-y-2">
            <Input
              className="font-mono"
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="KS-ABC123"
              value={code}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <Button
            className="w-full"
            disabled={!code.trim() || isLoading}
            type="submit"
          >
            {isLoading ? "Checking..." : "Access Course"}
          </Button>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Don't have access?
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={onClose}
              type="button"
              variant="outline"
            >
              I don&apos;t have an access code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
