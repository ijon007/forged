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

      {/* Polar Connection Status Card */}
      {polarStatus && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-blue-500" />
              Polar Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {polarStatus.isConnected ? (
                  polarStatus.needsReconnection ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-700 dark:text-yellow-300">
                          Connection Expired
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your Polar account needs to be reconnected to create checkouts
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        Needs Reconnection
                      </Badge>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          Connected
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {polarStatus.connectedAt && 
                            `Connected on ${new Date(polarStatus.connectedAt).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </>
                  )
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-300">
                        Not Connected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Connect your Polar account to start selling products
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Disconnected
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {polarStatus.isConnected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReconnect}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reconnect
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      disabled={isDisconnecting}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleReconnect}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Connect Polar
                  </Button>
                )}
              </div>
            </div>

            {(polarStatus.needsReconnection || !polarStatus.isConnected) && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> If you previously connected your Polar account, 
                  you may need to reconnect to grant the updated permissions required 
                  for creating checkout links.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 