"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Zap, 
    AlertTriangle, 
    CheckCircle, 
    RefreshCw, 
    ExternalLink,
    Building
} from "lucide-react"
import { toast } from "sonner"
import { disconnectPolarAccount } from "@/actions/polar-actions"
import { PolarDisconnectDialog } from "./polar-disconnect-dialog"
import { PolarReconnectDialog } from "./polar-reconnect-dialog"
import PolarConnectDialog from "./polar-connect-dialog"
import PolarPayoutInfoDialog from "./polar-payout-info-dialog"

interface PolarStatus {
    isConnected: boolean
    isTokenExpired?: boolean
    connectedAt?: Date | null
    needsReconnection?: boolean
    error?: string
    organizationInfo?: {
        id: string
        name: string
        slug: string
        email?: string | null
        website?: string | null
        avatar_url?: string | null
    } | null
}

interface UserData {
    polarUserId: string | null
    polarOrganizationId: string | null
    polarConnectedAt: Date | null
    polarTokenExpiresAt: Date | null
}

interface PolarConnectionProps {
    polarStatus: PolarStatus
    userData: UserData
}

export default function PolarConnection({ polarStatus, userData }: PolarConnectionProps) {
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
    const [showReconnectDialog, setShowReconnectDialog] = useState(false)
    const [showConnectDialog, setShowConnectDialog] = useState(false)
    const [showPayoutInfoDialog, setShowPayoutInfoDialog] = useState(false)

    const handleDisconnect = async () => {
        try {
            setIsDisconnecting(true)
            await disconnectPolarAccount()
            toast.success("Polar account disconnected successfully")
            window.location.reload()
        } catch (error) {
            toast.error("Failed to disconnect Polar account")
        } finally {
            setIsDisconnecting(false)
            setShowDisconnectDialog(false)
        }
    }

    const handleReconnect = () => {
        window.location.href = "/api/polar-oauth/authorize"
    }

    const handleConnect = () => {
        window.location.href = "/api/polar-oauth/authorize"
    }

    return (
        <div className="space-y-4">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
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
                                <div className="flex-1">
                                    <p className="font-medium text-green-700 dark:text-green-300">
                                        Connected
                                    </p>
                                    {polarStatus.organizationInfo ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">
                                                    <span className="font-medium">Organization:</span> {polarStatus.organizationInfo.name}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-5">
                                                <span className="font-medium">Username:</span> @{polarStatus.organizationInfo.slug}
                                            </p>
                                            {polarStatus.organizationInfo.email && (
                                                <p className="text-xs text-muted-foreground ml-5">
                                                    <span className="font-medium">Email:</span> {polarStatus.organizationInfo.email}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {polarStatus.connectedAt && 
                                                `Connected on ${new Date(polarStatus.connectedAt).toLocaleDateString()}`
                                            }
                                        </p>
                                    )}
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

                <div className="flex flex-col xl:flex-row gap-2">
                    {polarStatus.isConnected ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowReconnectDialog(true)}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Reconnect
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDisconnectDialog(true)}
                                disabled={isDisconnecting}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                Disconnect
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPayoutInfoDialog(true)}
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Payout Info
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            onClick={handleConnect}
                            className="flex items-center gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Connect Polar
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
                <div className="flex items-start gap-3">
                    {polarStatus.isConnected ? (
                        polarStatus.needsReconnection ? (
                            <>
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-yellow-700 dark:text-yellow-300">
                                            Connection Expired
                                        </p>
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                                            Expired
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your Polar account needs to be reconnected to create checkouts
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-green-700 dark:text-green-300">
                                            Connected
                                        </p>
                                    </div>
                                    {polarStatus.organizationInfo ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Building size={20} />
                                                <span className="text-base font-medium truncate">
                                                    <span className="font-medium">Organization:</span> {polarStatus.organizationInfo.name}
                                                </span>
                                            </div>
                                            <p className="text-base text-muted-foreground ml-5">
                                                <span className="font-medium">Username:</span> @{polarStatus.organizationInfo.slug}
                                            </p>
                                            {polarStatus.organizationInfo.email && (
                                                <p className="text-base text-muted-foreground truncate ml-5">
                                                    <span className="font-medium">Email:</span> {polarStatus.organizationInfo.email}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {polarStatus.connectedAt && 
                                                `Connected on ${new Date(polarStatus.connectedAt).toLocaleDateString()}`
                                            }
                                        </p>
                                    )}
                                </div>
                            </>
                        )
                    ) : (
                        <>
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-red-700 dark:text-red-300">
                                        Not Connected
                                    </p>
                                    <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                                        Disconnected
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Connect your Polar account to start selling products
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-2 w-full">
                    {polarStatus.isConnected ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowReconnectDialog(true)}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Reconnect
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDisconnectDialog(true)}
                                disabled={isDisconnecting}
                                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                Disconnect
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPayoutInfoDialog(true)}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Payout Info
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => setShowConnectDialog(true)}
                            className="w-full flex items-center justify-center gap-2"
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

            {/* Error Display */}
            {polarStatus.error && (
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">
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
                open={showDisconnectDialog}
                onOpenChange={setShowDisconnectDialog}
                onConfirm={handleDisconnect}
                organizationName={polarStatus.organizationInfo?.name}
                isLoading={isDisconnecting}
            />

            <PolarReconnectDialog
                open={showReconnectDialog}
                onOpenChange={setShowReconnectDialog}
                onConfirm={handleReconnect}
                organizationName={polarStatus.organizationInfo?.name}
            />

            <PolarPayoutInfoDialog
                isOpen={showPayoutInfoDialog}
                onClose={() => setShowPayoutInfoDialog(false)}
                orgSlug={polarStatus.organizationInfo?.slug ?? ""}
            />
        </div>
    )
} 