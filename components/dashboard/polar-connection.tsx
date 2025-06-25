"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Zap, 
    AlertTriangle, 
    CheckCircle, 
    RefreshCw, 
    ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { disconnectPolarAccount } from "@/actions/polar-actions"

interface PolarStatus {
    isConnected: boolean
    isTokenExpired?: boolean
    connectedAt?: Date | null
    needsReconnection?: boolean
    error?: string
}

interface UserData {
    polarUserId: string | null
    polarConnectedAt: Date | null
    polarTokenExpiresAt: Date | null
}

interface PolarConnectionProps {
    polarStatus: PolarStatus
    userData: UserData
}

export default function PolarConnection({ polarStatus, userData }: PolarConnectionProps) {
    const [isDisconnecting, setIsDisconnecting] = useState(false)

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
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
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
        </div>
    )
} 