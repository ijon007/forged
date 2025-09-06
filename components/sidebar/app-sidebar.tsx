"use client";

import { Crown, Sparkles } from "lucide-react";
import Image from "next/image";
import type * as React from "react";
import { useState } from "react";
import { PlanSelection } from "@/components/plan-selection";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Course } from "@/db/schemas/course-schema";
import { GoogleLoginButton } from "../login/login-google";
import { Button } from "../ui/button";
import { ChartColumnDecreasingIcon } from "../ui/chart-column-decreasing";
import { FoldersIcon } from "../ui/folders";
import { LayoutPanelTopIcon } from "../ui/layout-panel-top";
import { SettingsGearIcon } from "../ui/settings-gear";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  userCourses?: Course[];
  hasActiveSubscription?: boolean;
}

export function AppSidebar({
  user,
  userCourses = [],
  hasActiveSubscription = false,
  ...props
}: AppSidebarProps) {
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  const previewItems =
    userCourses.length > 0
      ? userCourses.map((course) => ({
          title: course.title,
          url: `/dashboard/preview/${course.slug}`,
        }))
      : [];

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutPanelTopIcon />,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: <ChartColumnDecreasingIcon />,
    },
    {
      title: "Preview",
      url: "/dashboard/preview",
      icon: <FoldersIcon />,
      items: previewItems.length > 0 ? previewItems : undefined,
    },
    {
      title: "Settings",
      url: "/dashboard/user",
      icon: <SettingsGearIcon />,
    },
  ];

  return (
    <Sidebar variant="inset" {...props} className="bg-neutral-100">
      <SidebarHeader className="bg-neutral-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Image
                alt="Forged"
                height={100}
                src="/forged-black.svg"
                width={100}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-100">
        <NavMain
          items={navMain}
          onItemClick={
            hasActiveSubscription ? undefined : () => setIsPlanDialogOpen(true)
          }
        />
      </SidebarContent>
      <SidebarFooter className="bg-neutral-100">
        {!user && (
          <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-100 p-3">
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                <span className="font-semibold text-black text-sm">
                  Upgrade to Premium
                </span>
              </div>
              <p className="mb-3 text-neutral-700 text-xs leading-relaxed">
                Unlock unlimited generations and advanced features
              </p>
              <Button
                className="w-full rounded-lg bg-black font-medium text-white hover:bg-black/90"
                onClick={() => setIsPlanDialogOpen(true)}
                size="sm"
              >
                <Sparkles className="mr-1 h-4 w-4" />
                Choose Plan
              </Button>
            </div>
          </div>
        )}

        {user ? (
          <NavUser
            hasActiveSubscription={hasActiveSubscription}
            user={{
              name: user.name,
              email: user.email,
              avatar: user.image || "",
            }}
          />
        ) : (
          <GoogleLoginButton />
        )}
      </SidebarFooter>

      <Dialog onOpenChange={setIsPlanDialogOpen} open={isPlanDialogOpen}>
        <DialogContent className="w-[500px]" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle className="mb-6 text-center font-bold text-2xl">
              Choose Your Plan
            </DialogTitle>
          </DialogHeader>
          <PlanSelection />
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
