"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolarReconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  organizationName?: string;
}

export function PolarReconnectDialog({
  open,
  onOpenChange,
  onConfirm,
  organizationName,
}: PolarReconnectDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 flex-shrink-0 text-blue-500" />
            <DialogTitle className="text-left">
              Reconnect Polar Account
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            You're about to reconnect your Polar account with updated
            permissions.
          </DialogDescription>
          {organizationName && (
            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
              <p className="text-blue-700 text-sm dark:text-blue-300">
                <strong>Current Organization:</strong> {organizationName}
              </p>
            </div>
          )}
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>This will:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Refresh your authentication with Polar</li>
              <li>Grant any new permissions required</li>
              <li>Ensure you can create products and checkouts</li>
              <li>Maintain your existing organization and products</li>
            </ul>
          </div>
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
            <p className="text-green-700 text-sm dark:text-green-300">
              <strong>Safe to proceed:</strong> Your existing products,
              customers, and sales data will remain unchanged.
            </p>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            className="order-1 w-full rounded-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 sm:order-2 sm:w-auto"
            onClick={onConfirm}
          >
            Reconnect Polar Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
