"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap, DollarSign, Shield } from "lucide-react";

interface PolarConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolarConnectionDialog({ open, onOpenChange }: PolarConnectionDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Connect Your Polar Account
          </DialogTitle>
          <DialogDescription asChild className="text-base space-y-4">
            <div>
              <p>
                To start monetizing your generated content, you'll need to connect your Polar account. 
                This allows you to create and sell products directly through your blog posts.
              </p>
              
              <div className="space-y-3">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Monetize Your Content</p>
                  <p className="text-sm text-muted-foreground">
                    Create products and accept payments directly from your generated blog posts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Secure & Easy</p>
                  <p className="text-sm text-muted-foreground">
                    Polar handles all payment processing, taxes, and customer management
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Your Account, Your Control</p>
                  <p className="text-sm text-muted-foreground">
                    You maintain full control over your products and earnings
                  </p>
                </div>
              </div>
            </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex-1"
          >
            {isConnecting ? "Connecting..." : "Connect Polar Account"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Skip for Now
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2">
          <p>
            Don't have a Polar account?{" "}
            <a 
              href="https://polar.sh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Create one here
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 