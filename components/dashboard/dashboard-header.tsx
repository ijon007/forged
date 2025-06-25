"use client"

import { Button } from "@/components/ui/button"
import { CreateCourseDialog } from "@/components/create-course-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { disconnectPolarAccount } from "@/actions/polar-actions"

interface DashboardHeaderProps {
  polarStatus?: {
    isConnected: boolean;
    isTokenExpired?: boolean;
    connectedAt?: Date | null;
    needsReconnection?: boolean;
    error?: string;
  };
}

export function DashboardHeader({ polarStatus }: DashboardHeaderProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnectPolarAccount();
      toast.success("Polar account disconnected successfully");
      window.location.reload(); // Refresh to update status
    } catch (error) {
      toast.error("Failed to disconnect Polar account");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleReconnect = () => {
    window.location.href = "/api/polar-oauth/authorize";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <CreateCourseDialog>
          <Button
            size="lg"
            className="group relative bg-black text-white hover:bg-gray-800 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Create Page</span>
            <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CreateCourseDialog>
      </div>
    </div>
  )
} 