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
import { RefreshCw } from "lucide-react"

interface PolarReconnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  organizationName?: string
}

export function PolarReconnectDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  organizationName
}: PolarReconnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <DialogTitle className="text-left">Reconnect Polar Account</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            <p>
              You're about to reconnect your Polar account with updated permissions.
            </p>
            
            {organizationName && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Current Organization:</strong> {organizationName}
                </p>
              </div>
            )}
            
            <div className="space-y-2 text-sm">
              <p><strong>This will:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Refresh your authentication with Polar</li>
                <li>Grant any new permissions required</li>
                <li>Ensure you can create products and checkouts</li>
                <li>Maintain your existing organization and products</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>Safe to proceed:</strong> Your existing products, customers, and sales data will remain unchanged.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 order-1 sm:order-2"
          >
            Continue to Polar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 