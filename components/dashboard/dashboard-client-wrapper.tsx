"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PolarConnectionDialog } from "./polar-ui/polar-connection-dialog";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
  polarStatus: {
    isConnected: boolean;
    isTokenExpired?: boolean;
    connectedAt?: Date | null;
    needsReconnection?: boolean;
    error?: string;
  };
}

export function DashboardClientWrapper({
  children,
  polarStatus,
}: DashboardClientWrapperProps) {
  const [showPolarDialog, setShowPolarDialog] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Handle OAuth callback parameters
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected === "true") {
      toast.success(
        "🎉 Polar account connected successfully! You can now create and sell products.",
        {
          duration: 5000,
        }
      );
      // Remove URL parameters and refresh to show updated status
      window.history.replaceState({}, "", "/dashboard");
      // Refresh the page to show updated connection status
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }

    if (error) {
      let errorMessage = "Failed to connect Polar account";
      switch (error) {
        case "oauth_failed":
          errorMessage = "OAuth authorization failed";
          break;
        case "missing_params":
          errorMessage = "Missing authorization parameters";
          break;
        case "invalid_state":
          errorMessage = "Invalid authorization state";
          break;
        case "token_exchange_failed":
          errorMessage = "Failed to exchange authorization code";
          break;
        case "userinfo_failed":
          errorMessage = "Failed to get user information from Polar";
          break;
        case "callback_failed":
          errorMessage = "OAuth callback processing failed";
          break;
      }

      toast.error(errorMessage);
      // Remove URL parameters without page reload
      window.history.replaceState({}, "", "/dashboard");
    }

    // Show connection dialog if user is not connected (and no error occurred)
    if (!(polarStatus.isConnected || error || connected)) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setShowPolarDialog(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Show reconnection notice if token is expired
    if (polarStatus.needsReconnection) {
      toast.warning(
        "Your Polar account connection has expired. Please reconnect to continue selling products."
      );
    }
  }, [searchParams, polarStatus, router]);

  return (
    <>
      {children}

      <PolarConnectionDialog
        onOpenChange={setShowPolarDialog}
        open={showPolarDialog}
      />
    </>
  );
}
