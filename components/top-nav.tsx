import Link from "next/link"
import {
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronDown,
  Command,
  CreditCard,
  LogOut,
  PlusCircle,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SignOut from "./login/sign-out"
import { getSession } from "@/actions/auth-actions"
import { redirect } from "next/navigation"


export async function TopNav() {
  const session = await getSession()
  const user = session?.user
  if (!user) {
    redirect("/login")
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between w-full px-6">

        {/* Center - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo and App Name */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Command className="h-4 w-4" />
            </div>
            <span className="hidden font-semibold sm:inline-block">
              Knowledgesmith
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link
              href={"/dashboard"}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-black",
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="inline-block">Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Right side - Profile Dropdown */}
        <div className="flex-1 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 rounded-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal mb-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <SignOut />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 