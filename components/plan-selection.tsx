"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { authClient, useSession } from "@/lib/auth-client";

export function PlanSelection() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const { data: session } = useSession();

  const isSignedIn = !!session?.user;

  useEffect(() => {
    const handleAutoCheckout = async () => {
      // Check if user just signed in and has a stored plan
      if (isSignedIn) {
        const selectedPlan = localStorage.getItem("selectedPlan");
        if (selectedPlan) {
          localStorage.removeItem("selectedPlan");
          
          try {
            const productId = selectedPlan === "yearly" 
              ? process.env.NEXT_PUBLIC_YEARLY_ID 
              : process.env.NEXT_PUBLIC_MONTHLY_ID;
            
            const slug = selectedPlan === "yearly" ? "forged-yearly" : "forged";

            if (!productId) {
              console.error(`Missing ${selectedPlan === 'yearly' ? 'YEARLY' : 'MONTHLY'}_ID environment variable`);
              return;
            }

            // Trigger checkout for the selected plan
            await authClient.checkout({
              products: [productId],
              slug,
            });
          } catch (error) {
            console.error("Auto-checkout error:", error);
          }
        }
      }
    };

    handleAutoCheckout();
  }, [isSignedIn]);

  const buyPlan = async () => {
    if (!isSignedIn) {
      // Store the selected plan and redirect to Google auth
      localStorage.setItem("selectedPlan", isYearly ? "yearly" : "monthly");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/dashboard",
      });
      return;
    }

    try {
      const productId = isYearly 
        ? process.env.NEXT_PUBLIC_YEARLY_ID 
        : process.env.NEXT_PUBLIC_MONTHLY_ID;
      
      const slug = isYearly ? "forged-yearly" : "forged";

      if (!productId) {
        console.error(`Missing ${isYearly ? 'YEARLY' : 'MONTHLY'}_ID environment variable`);
        alert(`Configuration error: Missing product ID for ${isYearly ? 'yearly' : 'monthly'} plan`);
        return;
      }

      if (isYearly) {
        setIsLoading("yearly");
      } else {
        setIsLoading("monthly");
      }

      await authClient.checkout({
        products: [productId],
        slug,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
      setIsLoading(null);
    }
  };

  const monthlyPrice = 20;
  const yearlyPrice = 160;
  const yearlyOriginalPrice = 240;
  const savings = yearlyOriginalPrice - yearlyPrice;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span
            className={`font-medium text-sm ${isYearly ? "text-neutral-500" : "text-neutral-900"}`}
          >
            Monthly
          </span>
          <Switch
            checked={isYearly}
            className="cursor-pointer"
            onCheckedChange={setIsYearly}
          />
          <span
            className={`font-medium text-sm ${isYearly ? "text-neutral-900" : "text-neutral-500"}`}
          >
            Yearly
          </span>
          <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-700 text-xs">
            Save ${savings}
          </span>
        </div>

        {/* Price Display */}
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-center">
            <span className="font-bold text-5xl text-neutral-900">
              ${isYearly ? yearlyPrice : monthlyPrice}
            </span>
            <span className="ml-1 text-neutral-500 text-lg">
              /{isYearly ? "year" : "month"}
            </span>
          </div>

          {isYearly && (
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="text-neutral-400 text-lg line-through">
                ${yearlyOriginalPrice}
              </span>
              <span className="font-medium text-green-700 text-sm">
                4 months free
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          className="mb-6 w-full rounded-xl bg-black py-4 font-medium text-white hover:bg-neutral-800"
          disabled={isLoading !== null}
          onClick={buyPlan}
        >
          {isLoading ? "Loading..." : "Start Creating"}
        </Button>

        {/* Features */}
        <div className="w-full space-y-3">
          <div className="flex items-center text-neutral-700">
            <Check className="mr-3 h-4 w-4 flex-shrink-0 text-neutral-600" />
            <span className="text-sm">Unlimited generations</span>
          </div>
          <div className="flex items-center text-neutral-700">
            <Check className="mr-3 h-4 w-4 flex-shrink-0 text-neutral-600" />
            <span className="text-sm">Hosted & Shareable</span>
          </div>
          <div className="flex items-center text-neutral-700">
            <Check className="mr-3 h-4 w-4 flex-shrink-0 text-neutral-600" />
            <span className="text-sm">Advanced analytics dashboard</span>
          </div>
          <div className="flex items-center text-neutral-700">
            <Check className="mr-3 h-4 w-4 flex-shrink-0 text-neutral-600" />
            <span className="text-sm">
              No platform fees{isYearly ? " - Earnings are all yours" : ""}
            </span>
          </div>
          {isYearly && (
            <div className="flex items-center text-neutral-700">
              <Check className="mr-3 h-4 w-4 flex-shrink-0 text-neutral-600" />
              <span className="text-sm">Billed yearly</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
