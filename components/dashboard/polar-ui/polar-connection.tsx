"use client";

import {
  AlertTriangle,
  Building,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { disconnectPolarAccount } from "@/actions/polar-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PolarConnectDialog from "./polar-connect-dialog";
import { PolarDisconnectDialog } from "./polar-disconnect-dialog";
import PolarPayoutInfoDialog from "./polar-payout-info-dialog";
import { PolarReconnectDialog } from "./polar-reconnect-dialog";

interface PolarStatus {
  isConnected: boolean;
  isTokenExpired?: boolean;
  connectedAt?: Date | null;
  needsReconnection?: boolean;
  error?: string;
  organizationInfo?: {
    id: string;
    name: string;
    slug: string;
    email?: string | null;
    website?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface UserData {
  polarUserId: string | null;
  polarOrganizationId: string | null;
  polarConnectedAt: Date | null;
  polarTokenExpiresAt: Date | null;
}

interface PolarConnectionProps {
  polarStatus: PolarStatus;
  userData: UserData;
}

export default function PolarConnection({
  polarStatus,
  userData,
}: PolarConnectionProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showReconnectDialog, setShowReconnectDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showPayoutInfoDialog, setShowPayoutInfoDialog] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnectPolarAccount();
      toast.success("Polar account disconnected successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to disconnect Polar account");
    } finally {
      setIsDisconnecting(false);
      setShowDisconnectDialog(false);
    }
  };

  const handleReconnect = () => {
    window.location.href = "/api/polar-oauth/authorize";
  };

  const handleConnect = () => {
    window.location.href = "/api/polar-oauth/authorize";
  };

  return (
    <div className="space-y-4">
      {/* Desktop Layout */}
      <div className="hidden items-center justify-between md:flex">
        <div className="flex items-center gap-3">
          {polarStatus.isConnected ? (
            polarStatus.needsReconnection ? (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-700 dark:text-yellow-300">
                    Connection Expired
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Your Polar account needs to be reconnected to create
                    checkouts
                  </p>
                </div>
                <Badge
                  className="bg-yellow-100 text-yellow-700"
                  variant="secondary"
                >
                  Needs Reconnection
                </Badge>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-green-700 dark:text-green-300">
                    Connected
                  </p>
                  {polarStatus.organizationInfo ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Organization:</span>{" "}
                          {polarStatus.organizationInfo.name}
                        </span>
                      </div>
                      <p className="ml-5 text-muted-foreground text-xs">
                        <span className="font-medium">Username:</span> @
                        {polarStatus.organizationInfo.slug}
                      </p>
                      {polarStatus.organizationInfo.email && (
                        <p className="ml-5 text-muted-foreground text-xs">
                          <span className="font-medium">Email:</span>{" "}
                          {polarStatus.organizationInfo.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {polarStatus.connectedAt &&
                        `Connected on ${new Date(polarStatus.connectedAt).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <Badge
                  className="bg-green-100 text-green-700"
                  variant="secondary"
                >
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
                <p className="text-muted-foreground text-sm">
                  Connect your Polar account to start selling products
                </p>
              </div>
              <Badge className="bg-red-100 text-red-700" variant="secondary">
                Disconnected
              </Badge>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 xl:flex-row">
          {polarStatus.isConnected ? (
            <>
              <Button
                className="flex items-center gap-2"
                onClick={() => setShowReconnectDialog(true)}
                size="sm"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Reconnect
              </Button>
              <Button
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                disabled={isDisconnecting}
                onClick={() => setShowDisconnectDialog(true)}
                size="sm"
                variant="outline"
              >
                Disconnect
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => setShowPayoutInfoDialog(true)}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
                Payout Info
              </Button>
            </>
          ) : (
            <Button
              className="flex items-center gap-2"
              onClick={handleConnect}
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              Connect Polar
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="space-y-3 md:hidden">
        <div className="flex items-start gap-3">
          {polarStatus.isConnected ? (
            polarStatus.needsReconnection ? (
              <>
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-medium text-yellow-700 dark:text-yellow-300">
                      Connection Expired
                    </p>
                    <Badge
                      className="bg-yellow-100 text-xs text-yellow-700"
                      variant="secondary"
                    >
                      Expired
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Your Polar account needs to be reconnected to create
                    checkouts
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-medium text-green-700 dark:text-green-300">
                      Connected
                    </p>
                  </div>
                  {polarStatus.organizationInfo ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building size={20} />
                        <span className="truncate font-medium text-base">
                          <span className="font-medium">Organization:</span>{" "}
                          {polarStatus.organizationInfo.name}
                        </span>
                      </div>
                      <p className="ml-5 text-base text-muted-foreground">
                        <span className="font-medium">Username:</span> @
                        {polarStatus.organizationInfo.slug}
                      </p>
                      {polarStatus.organizationInfo.email && (
                        <p className="ml-5 truncate text-base text-muted-foreground">
                          <span className="font-medium">Email:</span>{" "}
                          {polarStatus.organizationInfo.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {polarStatus.connectedAt &&
                        `Connected on ${new Date(polarStatus.connectedAt).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </>
            )
          ) : (
            <>
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-medium text-red-700 dark:text-red-300">
                    Not Connected
                  </p>
                  <Badge
                    className="bg-red-100 text-red-700 text-xs"
                    variant="secondary"
                  >
                    Disconnected
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Connect your Polar account to start selling products
                </p>
              </div>
            </>
          )}
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex w-full flex-col gap-2">
          {polarStatus.isConnected ? (
            <>
              <Button
                className="flex w-full items-center justify-center gap-2"
                onClick={() => setShowReconnectDialog(true)}
                size="sm"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Reconnect
              </Button>
              <Button
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                disabled={isDisconnecting}
                onClick={() => setShowDisconnectDialog(true)}
                size="sm"
                variant="outline"
              >
                Disconnect
              </Button>
              <Button
                className="flex w-full items-center justify-center gap-2"
                onClick={() => setShowPayoutInfoDialog(true)}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
                Payout Info
              </Button>
            </>
          ) : (
            <Button
              className="flex w-full items-center justify-center gap-2"
              onClick={() => setShowConnectDialog(true)}
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              Connect Polar
            </Button>
          )}
        </div>
      </div>

      {(polarStatus.needsReconnection || !polarStatus.isConnected) && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
          <p className="text-blue-700 text-sm dark:text-blue-300">
            <strong>Note:</strong> If you previously connected your Polar
            account, you may need to reconnect to grant the updated permissions
            required for creating checkout links.
          </p>
        </div>
      )}

      {/* Error Display */}
      {polarStatus.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
          <p className="text-red-700 text-sm dark:text-red-300">
            <strong>Error:</strong> {polarStatus.error}
          </p>
        </div>
      )}

      <PolarConnectDialog
        isOpen={showConnectDialog}
        onClose={() => setShowConnectDialog(false)}
      />

      {/* Confirmation Dialogs */}
      <PolarDisconnectDialog
        isLoading={isDisconnecting}
        onConfirm={handleDisconnect}
        onOpenChange={setShowDisconnectDialog}
        open={showDisconnectDialog}
        organizationName={polarStatus.organizationInfo?.name}
      />

      <PolarReconnectDialog
        onConfirm={handleReconnect}
        onOpenChange={setShowReconnectDialog}
        open={showReconnectDialog}
        organizationName={polarStatus.organizationInfo?.name}
      />

      <PolarPayoutInfoDialog
        isOpen={showPayoutInfoDialog}
        onClose={() => setShowPayoutInfoDialog(false)}
        orgSlug={polarStatus.organizationInfo?.slug ?? ""}
      />
    </div>
  );
}
