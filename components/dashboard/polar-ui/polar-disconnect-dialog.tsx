"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolarDisconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  organizationName?: string;
  isLoading?: boolean;
}

export function PolarDisconnectDialog({
  open,
  onOpenChange,
  onConfirm,
  organizationName,
  isLoading = false,
}: PolarDisconnectDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500" />
            <DialogTitle className="text-left">
              Disconnect Polar Account
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Are you sure you want to disconnect your Polar account?
          </DialogDescription>
        </DialogHeader>
        {organizationName && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
            <p className="text-red-700 text-sm dark:text-red-300">
              <strong>Connected Organization:</strong> {organizationName}
            </p>
          </div>
        )}
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <strong>This will:</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Remove your ability to create new products</li>
            <li>Disable checkout creation for your courses</li>
            <li>Stop receiving payments for new sales</li>
            <li>Require reconnection to resume selling</li>
          </ul>
        </div>
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-amber-700 text-sm dark:text-amber-300">
            <strong>Note:</strong> Existing products and active sales will not
            be affected, but you won't be able to create new ones until you
            reconnect.
          </p>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            className="order-1 w-full rounded-xl bg-red-600 hover:bg-red-700 focus:ring-red-600 sm:order-2 sm:w-auto"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Disconnecting..." : "Disconnect Polar Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
