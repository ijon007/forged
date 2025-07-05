"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface PolarDisconnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  organizationName?: string
  isLoading?: boolean
}

export function PolarDisconnectDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  organizationName,
  isLoading = false
}: PolarDisconnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <DialogTitle className="text-left">Disconnect Polar Account</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Are you sure you want to disconnect your Polar account?
          </DialogDescription>
        </DialogHeader>
        {organizationName && (
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800 mt-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Connected Organization:</strong> {organizationName}
            </p>
          </div>
        )}
        <div className="space-y-2 text-sm mt-3">
          <p><strong>This will:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Remove your ability to create new products</li>
            <li>Disable checkout creation for your courses</li>
            <li>Stop receiving payments for new sales</li>
            <li>Require reconnection to resume selling</li>
          </ul>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 mt-3">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Note:</strong> Existing products and active sales will not be affected, 
            but you won't be able to create new ones until you reconnect.
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600 order-1 sm:order-2 rounded-xl"
          >
            {isLoading ? "Disconnecting..." : "Disconnect Polar Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 