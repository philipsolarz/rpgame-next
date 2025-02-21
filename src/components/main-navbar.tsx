"use client"

import { Home, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const mainNavItems = [
    {
        title: "Home",
        icon: Home,
        href: "/",
    },
    {
        title: "Characters",
        icon: Users,
        href: "/characters",
    },
    {
        title: "Conversations",
        icon: MessageSquare,
        href: "/conversations",
    },
]

export function MainNav() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="none" className="border-r">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(item.href) && item.href !== "/" ? true : pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

