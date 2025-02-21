"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Sample data
const conversations = [
    { id: 1, title: "Project Discussion", lastMessage: "Let's review the designs" },
    { id: 2, title: "Team Meeting", lastMessage: "Updates on the roadmap" },
    { id: 3, title: "Client Feedback", lastMessage: "Great progress!" },
    { id: 4, title: "Bug Report", lastMessage: "Found an issue in production" },
]

export function ConversationsList() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="none" className="w-[300px] border-r" style={{ height: "calc(100vh - var(--header-height))" }}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {conversations.map((conversation) => (
                                <SidebarMenuItem key={conversation.id}>
                                    <SidebarMenuButton asChild isActive={pathname === `/conversations/${conversation.id}`}>
                                        <Link href={`/conversations/${conversation.id}`}>
                                            <MessageCircle className="h-4 w-4" />
                                            <div className="flex flex-col items-start">
                                                <span>{conversation.title}</span>
                                                <span className="text-xs text-muted-foreground">{conversation.lastMessage}</span>
                                            </div>
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

