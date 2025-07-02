"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    CreditCard, 
    Calendar, 
    Crown, 
    CheckCircle, 
    AlertTriangle,
    Wallet
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
import { Button } from "../ui/button"
import { authClient } from "@/lib/auth-client"

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
                    return <CheckCircle className="h-3 w-3" />
                case "canceled":
                case "revoked":
                    return <AlertTriangle className="h-3 w-3" />
                default:
                    return null
            }
        }

        return (
            <Badge variant={statusVariant.variant} className={`${statusVariant.className} flex items-center gap-1.5`}>
                {getIcon()}
                {label}
            </Badge>
        )
    }

    const getPlanIcon = () => {
        if (planType === "yearly") {
            return <Crown className="h-4 w-4 text-amber-500" />
        }
        return <CreditCard className="h-4 w-4 text-slate-500" />
    }

    const openPortal = async () => {
        await authClient.customer.portal();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="h-5 w-5 text-green-500" />
                    Subscription
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getPlanIcon()}
                            <span className="font-medium">{getPlanTypeLabel(planType)}</span>
                        </div>
                        {getStatusBadge()}
                    </div>

                    {endsAt && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                {hasActiveSubscription ? "Next billing" : "Expires"}
                            </span>
                            <span className="font-medium">{formatSubscriptionEndDate(endsAt)}</span>
                        </div>
                    )}

                    {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                        <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-md">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                        </div>
                    )}

                    {isExpired && (
                        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-md">
                            Subscription expired
                        </div>
                    )}
                </div>
                <div className="pt-4 border-t mt-5">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={openPortal}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/30 rounded-md transition-colors"
                        >
                            <CreditCard className="h-4 w-4" />
                            Manage Billing
                        </Button>
                        <div className="text-sm text-muted-foreground flex items-center">
                            <span>You can upgrade or change your plan anytime through the billing portal</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 