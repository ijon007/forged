"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface PolarConnectionCheckProps {
  isConnected: boolean;
  needsReconnection?: boolean;
}

export function PolarConnectionCheck({ isConnected, needsReconnection }: PolarConnectionCheckProps) {
  useEffect(() => {
    if (!isConnected) {
      toast.error("Polar account not connected. Please connect your account in settings to view analytics.");
    } else if (needsReconnection) {
      toast.error("Polar connection expired. Please reconnect your account.");
    }
  }, [isConnected, needsReconnection]);

  return null;
}
