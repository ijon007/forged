"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartColumnDecreasingIcon } from "../ui/chart-column-decreasing"
import { LayoutPanelTopIcon } from "../ui/layout-panel-top"
import { FoldersIcon } from "../ui/folders"
import { SettingsGearIcon } from "../ui/settings-gear"

import { getUserCourses } from "@/actions/course-db-actions"
import type { Course } from "@/db/schemas/course-schema"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [userCourses, setUserCourses] = React.useState<Course[]>([])

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getUserCourses()
        setUserCourses(courses)
      } catch (error) {
        console.error('Error fetching user courses:', error)
        setUserCourses([])
      }
    }
    
    fetchCourses()
  }, [])

  const previewItems = userCourses.length > 0 
    ? userCourses.map(course => ({
        title: course.title,
        url: `/dashboard/preview/${course.id}`,
      }))
    : []

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
        icon: <SettingsGearIcon />
      },
  ]

  return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <Image src="/forged-black.svg" alt="Forged" width={100} height={100} />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser 
                    user={{
                        name: user.name,
                        email: user.email,
                        avatar: user.image || ""
                    }} 
                />
            </SidebarFooter>
        </Sidebar>
  )
}
