"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Check, X, Mail, Calendar, User } from "lucide-react"
import { toast } from "sonner"

interface UserData {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: Date
    updatedAt: Date
}

interface UserProfileProps {
    userData: UserData
}

export default function UserProfile({ userData }: UserProfileProps) {

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.image || ""} alt={userData.name} />
                    <AvatarFallback className="text-lg">
                        {getInitials(userData.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Member since</span>
                        <span className="text-sm font-medium">
                            {new Date(userData.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name
                    </Label>
                    <span className="font-medium">{userData.name}</span>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                    </Label>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{userData.email}</span>
                            {userData.emailVerified ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    Verified
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                    Unverified
                                </Badge>
                            )}
                        </div>
                    </div>
                    {!userData.emailVerified && (
                        <p className="text-sm text-muted-foreground">
                            Please check your email to verify your account
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
} 