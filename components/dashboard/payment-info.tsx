"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
    CreditCard, 
    Calendar, 
    DollarSign, 
    Crown, 
    CheckCircle, 
    AlertTriangle,
    ExternalLink 
} from "lucide-react"

interface UserData {
    polarCustomerId: string | null
    subscriptionId: string | null
    subscriptionStatus: string | null
    planType: string | null
    subscriptionEndsAt: Date | null
}

interface PaymentInfoProps {
    userData: UserData
}

export function PaymentInfo({ userData }: PaymentInfoProps) {
    const hasActiveSubscription = userData.subscriptionStatus === "active"
    const isExpired = userData.subscriptionEndsAt 
        ? new Date() > userData.subscriptionEndsAt 
        : false

    const getStatusBadge = () => {
        if (!userData.subscriptionStatus) {
            return (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    No Subscription
                </Badge>
            )
        }

        switch (userData.subscriptionStatus) {
            case "active":
                return (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Cancelled
                    </Badge>
                )
            case "revoked":
                return (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Revoked
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        {userData.subscriptionStatus}
                    </Badge>
                )
        }
    }

    const getPlanIcon = () => {
        if (userData.planType === "yearly") {
            return <Crown className="h-4 w-4 text-yellow-500" />
        }
        return <CreditCard className="h-4 w-4" />
    }

    const getPlanName = () => {
        if (!userData.planType) return "No Plan"
        return userData.planType === "yearly" ? "Yearly Plan" : "Monthly Plan"
    }

    const handleManageBilling = () => {
        // TODO: Implement billing portal redirect
        window.open("https://polar.sh/billing", "_blank")
    }

    const handleUpgrade = () => {
        // Redirect to pricing page
        window.location.href = "/pricing"
    }

    return (
        <div className="space-y-6">
            {/* Subscription Status */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Subscription Status
                </Label>
                <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    {isExpired && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                            Expired
                        </Badge>
                    )}
                </div>
            </div>

            {/* Plan Information */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    {getPlanIcon()}
                    Current Plan
                </Label>
                <div className="flex items-center justify-between">
                    <span className="font-medium">{getPlanName()}</span>
                    {!hasActiveSubscription && (
                        <Button size="sm" onClick={handleUpgrade}>
                            Upgrade
                        </Button>
                    )}
                </div>
            </div>

            {/* Subscription Details */}
            {userData.subscriptionId && (
                <>
                    <div className="space-y-2">
                        <Label>Subscription ID</Label>
                        <div className="font-mono text-sm bg-muted p-2 rounded border">
                            {userData.subscriptionId}
                        </div>
                    </div>

                    {userData.subscriptionEndsAt && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {hasActiveSubscription ? "Next Billing Date" : "Expires On"}
                            </Label>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {new Date(userData.subscriptionEndsAt).toLocaleDateString()}
                                </span>
                                {isExpired && (
                                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                                        Expired
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Customer ID */}
            {userData.polarCustomerId && (
                <div className="space-y-2">
                    <Label>Customer ID</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded border">
                        {userData.polarCustomerId}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t">
                {hasActiveSubscription ? (
                    <div className="space-y-2">
                        <Button
                            onClick={handleManageBilling}
                            className="w-full"
                            variant="outline"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Manage Billing
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Access your billing portal to update payment methods, download invoices, and manage your subscription
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Button onClick={handleUpgrade} className="w-full">
                            <Crown className="h-4 w-4 mr-2" />
                            Subscribe Now
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Get access to premium features with a subscription
                        </p>
                    </div>
                )}
            </div>

            {/* Additional Info */}
            {!hasActiveSubscription && (
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Need a subscription?</strong> Subscribe to access premium features 
                        including unlimited pages, custom domains, and priority support.
                    </p>
                </div>
            )}
        </div>
    )
} 