import { Home, MessageSquare, Settings, Users } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Profile", icon: Home, href: "/profile" },
    { title: "Conversations", icon: Home, href: "/conversations" },
    { title: "Chat", icon: MessageSquare, href: "/chat" },
    { title: "Users", icon: Users, href: "/users" },
    { title: "Settings", icon: Settings, href: "/settings" },
    { title: "Login", icon: Settings, href: "/login" },
    { title: "Signup", icon: Settings, href: "/signup" },
    { title: "Signout", icon: Settings, href: "/signup" },
]

export function NavigationSidebar() {
    return (
        <Sidebar className="w-64">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <MessageSquare className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">Chat App</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </a>
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

