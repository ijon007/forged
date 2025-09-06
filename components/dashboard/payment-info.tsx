"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CreditCard,
  Crown,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  formatSubscriptionEndDate,
  getDaysUntilExpiry,
  getPlanTypeLabel,
  getSubscriptionStatusLabel,
  getSubscriptionStatusVariant,
  isSubscriptionActive,
  isSubscriptionExpired,
  type PlanType,
  type SubscriptionStatus,
} from "@/utils/subscription";
import { Button } from "../ui/button";

interface UserData {
  polarCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  planType: string | null;
  subscriptionEndsAt: Date | null;
}

interface PaymentInfoProps {
  userData: UserData;
}

export function PaymentInfo({ userData }: PaymentInfoProps) {
  const status = userData.subscriptionStatus as SubscriptionStatus;
  const planType = userData.planType as PlanType;
  const endsAt = userData.subscriptionEndsAt;

  const hasActiveSubscription = isSubscriptionActive(status, endsAt);
  const isExpired = isSubscriptionExpired(endsAt);
  const daysUntilExpiry = getDaysUntilExpiry(endsAt);

  const getStatusBadge = () => {
    const statusVariant = getSubscriptionStatusVariant(status);
    const label = getSubscriptionStatusLabel(status);

    const getIcon = () => {
      switch (status) {
        case "active":
          return <CheckCircle className="h-3 w-3" />;
        case "canceled":
        case "revoked":
          return <AlertTriangle className="h-3 w-3" />;
        default:
          return null;
      }
    };

    return (
      <Badge
        className={`${statusVariant.className} flex items-center gap-1.5`}
        variant={statusVariant.variant}
      >
        {getIcon()}
        {label}
      </Badge>
    );
  };

  const getPlanIcon = () => {
    if (planType === "yearly") {
      return <Crown className="h-4 w-4 text-amber-500" />;
    }
    return <CreditCard className="h-4 w-4 text-slate-500" />;
  };

  const openPortal = async () => {
    await authClient.customer.portal();
  };

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
              <span className="font-medium">
                {formatSubscriptionEndDate(endsAt)}
              </span>
            </div>
          )}

          {daysUntilExpiry !== null &&
            daysUntilExpiry <= 7 &&
            daysUntilExpiry > 0 && (
              <div className="rounded-md bg-amber-50 px-3 py-2 text-amber-600 text-sm dark:bg-amber-950/20">
                Expires in {daysUntilExpiry} day
                {daysUntilExpiry !== 1 ? "s" : ""}
              </div>
            )}

          {isExpired && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-red-600 text-sm dark:bg-red-950/20">
              Subscription expired
            </div>
          )}
        </div>
        <div className="mt-5 border-t pt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex items-center justify-center gap-2 rounded-md bg-blue-50 px-4 py-2 font-medium text-blue-600 text-sm transition-colors hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/30"
              onClick={openPortal}
            >
              <CreditCard className="h-4 w-4" />
              Manage Billing
            </Button>
            <div className="flex items-center text-muted-foreground text-sm">
              <span>
                You can upgrade or change your plan anytime through the billing
                portal
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
