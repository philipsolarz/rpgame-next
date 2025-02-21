"use client"

import * as React from "react"
import { AlertCircle, Bell, Crown, Search, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PremiumDialog } from "./premium-dialog"
import { createClient } from '@/utils/supabase/client'
import { redirect } from "next/navigation"

import { User as InterfaceUser } from "@/lib/api"

interface TopBarProps {
    user: InterfaceUser
}

export function TopBar({ user }: TopBarProps) {
    const [showSearch, setShowSearch] = React.useState(false)
    const [showPremium, setShowPremium] = React.useState(false)
    const [openUserMenu, setOpenUserMenu] = React.useState(false)

    const supabase = createClient()

    const handleLogout = () => {
        setOpenUserMenu(false)
        supabase.auth.signOut()
        redirect('/')
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background">
                <div className="flex h-16 items-center gap-4 px-4">
                    <div className="flex items-center gap-2 md:gap-4">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-6" />
                        <div className="relative hidden md:block lg:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search agents, chats..." className="w-[300px] pl-8" />
                        </div>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(true)}>
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {user.account_type === "free" && (
                            <Button variant="secondary" size="sm" className="hidden md:flex" onClick={() => setShowPremium(true)}>
                                <Crown className="mr-2 h-4 w-4" />
                                Upgrade to Premium
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                            3
                                        </span>
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup className="p-2">
                                    <div className="text-sm text-muted-foreground">No new notifications</div>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu open={openUserMenu} onOpenChange={setOpenUserMenu}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                                    <Avatar className="h-8 w-8">
                                        {/* <AvatarImage src={user.name} alt={user.name} /> */}
                                        <AvatarFallback>
                                            {user.first_name[0]}{user.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.first_name} {user.last_name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    {user.account_type === "free" && (
                                        <DropdownMenuItem onClick={() => setShowPremium(true)}>
                                            <Crown className="mr-2 h-4 w-4" />
                                            <span>Upgrade to Premium</span>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    <span>Help & Support</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <span>Log out</span>
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <Dialog open={showSearch} onOpenChange={setShowSearch}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Search</DialogTitle>
                    </DialogHeader>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search agents, chats..." className="pl-8" />
                    </div>
                </DialogContent>
            </Dialog>

            <PremiumDialog open={showPremium} onOpenChange={setShowPremium} />
        </>
    )
}

