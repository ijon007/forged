"use client";

import { DollarSign, ExternalLink, Shield, Zap } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolarConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolarConnectionDialog({
  open,
  onOpenChange,
}: PolarConnectionDialogProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Redirect to OAuth authorization endpoint
      window.location.href = "/api/polar-oauth/authorize";
    } catch (error) {
      console.error("Failed to initiate OAuth:", error);
      setIsConnecting(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Connect Your Polar Account
          </DialogTitle>
          <DialogDescription asChild className="space-y-4 text-base">
            <div>
              <p>
                To start monetizing your generated content, you'll need to
                connect your Polar account. This allows you to create and sell
                products directly through your blog posts.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium">Monetize Your Content</p>
                    <p className="text-muted-foreground text-sm">
                      Create products and accept payments directly from your
                      generated blog posts
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div>
                    <p className="font-medium">Secure & Easy</p>
                    <p className="text-muted-foreground text-sm">
                      Polar handles all payment processing, taxes, and customer
                      management
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ExternalLink className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500" />
                  <div>
                    <p className="font-medium">Your Account, Your Control</p>
                    <p className="text-muted-foreground text-sm">
                      You maintain full control over your products and earnings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button
            className="flex-1"
            disabled={isConnecting}
            onClick={handleConnect}
          >
            {isConnecting ? "Connecting..." : "Connect Polar Account"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <Button
            className="flex-1"
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Skip for Now
          </Button>
        </div>

        <div className="pt-2 text-muted-foreground text-xs">
          <p>
            Don't have a Polar account?{" "}
            <a
              className="text-blue-500 hover:underline"
              href="https://polar.sh"
              rel="noopener noreferrer"
              target="_blank"
            >
              Create one here
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
