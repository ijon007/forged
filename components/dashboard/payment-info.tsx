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
import {
    isSubscriptionActive,
    isSubscriptionExpired,
    getSubscriptionStatusLabel,
    getPlanTypeLabel,
    getSubscriptionStatusVariant,
    formatSubscriptionEndDate,
    getDaysUntilExpiry,
    type SubscriptionStatus,
    type PlanType
} from "@/utils/subscription"

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
    const status = userData.subscriptionStatus as SubscriptionStatus
    const planType = userData.planType as PlanType
    const endsAt = userData.subscriptionEndsAt

    const hasActiveSubscription = isSubscriptionActive(status, endsAt)
    const isExpired = isSubscriptionExpired(endsAt)
    const daysUntilExpiry = getDaysUntilExpiry(endsAt)

    const getStatusBadge = () => {
        const statusVariant = getSubscriptionStatusVariant(status)
        const label = getSubscriptionStatusLabel(status)

        const getIcon = () => {
            switch (status) {
                case "active":
                    return <CheckCircle className="h-3 w-3 mr-1" />
                case "canceled":
                case "revoked":
                    return <AlertTriangle className="h-3 w-3 mr-1" />
                default:
                    return null
            }
        }

        return (
            <Badge variant={statusVariant.variant} className={statusVariant.className}>
                {getIcon()}
                {label}
            </Badge>
        )
    }

    const getPlanIcon = () => {
        if (planType === "yearly") {
            return <Crown className="h-4 w-4 text-yellow-500" />
        }
        return <CreditCard className="h-4 w-4" />
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
                    {hasActiveSubscription && daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
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
                    <span className="font-medium">{getPlanTypeLabel(planType)}</span>
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

                    {endsAt && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {hasActiveSubscription ? "Next Billing Date" : "Expires On"}
                            </Label>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {formatSubscriptionEndDate(endsAt)}
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
            <div className="text-xs text-muted-foreground space-y-1">
                <p>• All subscription management is handled through Polar</p>
                <p>• Changes may take a few minutes to reflect</p>
                {status === "canceled" && hasActiveSubscription && (
                    <p className="text-orange-600">• Your subscription is canceled but remains active until {formatSubscriptionEndDate(endsAt)}</p>
                )}
            </div>
        </div>
    )
} 