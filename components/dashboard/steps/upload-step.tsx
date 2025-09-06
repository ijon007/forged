"use client";

import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UploadStepProps {
  file: File | null;
  uploadProgress: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onContinue: () => void;
}

export default function UploadStep({
  file,
  uploadProgress,
  onFileUpload,
  onReset,
  onContinue,
}: UploadStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-center">
        <label
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted hover:bg-muted/80"
          htmlFor="pdf-upload"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-muted-foreground text-sm">
              <span className="font-semibold">Click to upload</span> your PDF
            </p>
            <p className="text-muted-foreground text-xs">PDF files only</p>
          </div>
          <input
            accept=".pdf"
            className="hidden"
            id="pdf-upload"
            onChange={onFileUpload}
            type="file"
          />
        </label>
      </div>

      {file && (
        <Card>
          <CardContent className="px-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium text-sm">{file.name}</span>
              <Button onClick={onReset} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {file && uploadProgress === 100 && (
        <div className="flex justify-end">
          <Button className="w-full sm:w-auto" onClick={onContinue}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
