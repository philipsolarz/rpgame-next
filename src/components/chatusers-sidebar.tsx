import { Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface User {
    name: string
    avatarColor: string
    isOnline?: boolean
}

interface UsersSidebarProps {
    users: User[]
}

export function ChatUsersSidebar({ users }: UsersSidebarProps) {
    return (
        <Sidebar side="right" className="w-64">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Users className="size-4" />
                            <span className="font-semibold">Users in Chat</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {users.map((user) => (
                                <SidebarMenuItem key={user.name}>
                                    <SidebarMenuButton>
                                        <Avatar className={cn("h-6 w-6", user.avatarColor)}>
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{user.name}</span>
                                        <span
                                            className={cn("ml-auto h-2 w-2 rounded-full", user.isOnline ? "bg-green-500" : "bg-gray-300")}
                                        />
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

