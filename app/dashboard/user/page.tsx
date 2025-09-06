import { Zap } from "lucide-react";
import { redirect } from "next/navigation";
import { getUserData } from "@/actions/auth-actions";
import { getPolarConnectionStatus } from "@/actions/polar-actions";
import { PaymentInfo } from "@/components/dashboard/payment-info";
import PolarConnection from "@/components/dashboard/polar-ui/polar-connection";
import UserProfile from "@/components/dashboard/user-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function UserPage() {
  const [userData, polarStatus] = await Promise.all([
    getUserData(),
    getPolarConnectionStatus(),
  ]);

  if (!userData) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8 lg:px-32">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-bold text-3xl text-transparent tracking-tight dark:from-gray-100 dark:to-gray-300">
            Profile
          </h1>
          <SidebarTrigger className="block md:hidden" />
        </div>
        <p className="mt-2 text-muted-foreground">
          Manage your account information, subscription, and connected services
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <UserProfile userData={userData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Polar Account Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PolarConnection polarStatus={polarStatus} userData={userData} />
            </CardContent>
          </Card>
        </div>

        <div>
          <PaymentInfo userData={userData} />
        </div>
      </div>
    </div>
  );
}

export default UserPage;
