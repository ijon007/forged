// Subscription status types
export type SubscriptionStatus = 
  | "active" 
  | "canceled" 
  | "revoked" 
  | "incomplete" 
  | "incomplete_expired"
  | "past_due" 
  | "unpaid"
  | null;

export type PlanType = "monthly" | "yearly" | null;

// Subscription details interface
export interface SubscriptionDetails {
  isActive: boolean;
  isExpired: boolean;
  status: SubscriptionStatus;
  planType: PlanType;
  endsAt: Date | null;
  subscriptionId: string | null;
}

// Check if a subscription status is considered "active" (user has access)
export function isSubscriptionActive(
  status: SubscriptionStatus,
  endsAt: Date | null
): boolean {
  if (!status || !endsAt) {
    return false;
  }

  // These statuses mean the user still has access
  const activeStatuses: SubscriptionStatus[] = ["active", "canceled"];
  
  if (!activeStatuses.includes(status)) {
    return false;
  }

  // Check if not expired
  const now = new Date();
  return new Date(endsAt) > now;
}

// Check if subscription is expired
export function isSubscriptionExpired(endsAt: Date | null): boolean {
  if (!endsAt) {
    return false;
  }
  
  return new Date() > new Date(endsAt);
}

// Get human-readable subscription status
export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "canceled":
      return "Canceled";
    case "revoked":
      return "Revoked";
    case "incomplete":
      return "Incomplete";
    case "incomplete_expired":
      return "Incomplete (Expired)";
    case "past_due":
      return "Past Due";
    case "unpaid":
      return "Unpaid";
    case null:
      return "No Subscription";
    default:
      return "Unknown";
  }
}

// Get human-readable plan type
export function getPlanTypeLabel(planType: PlanType): string {
  switch (planType) {
    case "monthly":
      return "Monthly Plan";
    case "yearly":
      return "Yearly Plan";
    case null:
      return "No Plan";
    default:
      return "Unknown Plan";
  }
}

// Get subscription status color/variant for UI components
export function getSubscriptionStatusVariant(status: SubscriptionStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
} {
  switch (status) {
    case "active":
      return {
        variant: "secondary",
        className: "bg-green-100 text-green-700 hover:bg-green-200"
      };
    case "canceled":
      return {
        variant: "secondary", 
        className: "bg-orange-100 text-orange-700 hover:bg-orange-200"
      };
    case "revoked":
    case "unpaid":
      return {
        variant: "destructive",
        className: "bg-red-100 text-red-700 hover:bg-red-200"
      };
    case "past_due":
    case "incomplete":
    case "incomplete_expired":
      return {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      };
    case null:
      return {
        variant: "outline",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-200"
      };
    default:
      return {
        variant: "secondary",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-200"
      };
  }
}

// Calculate days until subscription ends
export function getDaysUntilExpiry(endsAt: Date | null): number | null {
  if (!endsAt) {
    return null;
  }

  const now = new Date();
  const endDate = new Date(endsAt);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Format subscription end date
export function formatSubscriptionEndDate(endsAt: Date | null): string {
  if (!endsAt) {
    return "No end date";
  }

  return new Date(endsAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric"
  });
} 