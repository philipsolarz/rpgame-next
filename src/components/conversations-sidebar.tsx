"use client"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import api from '@/lib/api'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"

export interface Conversation {
    id: string
    name: string
    lastMessage: string
    timestamp: string
    unreadCount: number
    isOnline: boolean
    isGroup?: boolean
}

interface ConversationsSidebarProps {
    conversations: Conversation[]
}


function formatTimestamp(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
}

// export async function ConversationsSidebar({ conversations }: ConversationsSidebarProps) {
export async function ConversationsSidebar() {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }


    const authUser = data.user
    const userId = authUser.id
    const user = await api.users.getUser(userId)
    const userConversations = await api.users.getUserConversations(userId)

    // Process each conversation to fetch the last message and create a Conversation object
    const conversations = await Promise.all(
        userConversations.map(async (conv: any) => {
            // Fetch the last message for this conversation
            const lastMessageResponse = await api.conversations.getLastMessageForConversation(conv.id)

            // Assume lastMessageResponse returns an object like { message: string, created_at: string }
            const lastMessageData = lastMessageResponse || { message: "No messages", created_at: new Date().toISOString() }

            // Format the timestamp from the last message's creation time
            const timestamp = formatTimestamp(lastMessageData.created_at)

            // Build the conversation object matching the Conversation interface.
            return {
                id: conv.id,
                name: conv.title, // translating title to name
                lastMessage: lastMessageData.content,
                timestamp,
                unreadCount: 0, // hard-coded value for now
                isOnline: false, // hard-coded value for now
                isGroup: conv.isGroup || false, // fallback to false if not defined
            }
        })
    )
    // Get title for each conversation
    // get last messages for each userConversation by first getting the ids of the conversations and then  calling api.conversations.getLastMessageForConversation
    // const lastMessage = await api.conversations.getLastMessageForConversation
    // Then we want to calculate the timestamp in short format from the lastMessage.created_at
    // for     unreadCount: number isOnline: boolean isGroup?: boolean we will need to hard code these values for now
    // we also need to translate the conversation title to name
    // We do this so that we can send conversations to the ConversationsSidebar component as it expects an array of Conversation objects

    const pathname = usePathname()
    const currentId = pathname.startsWith("/conversations/") ? pathname.split("/").pop() : null

    return (
        <Sidebar side="right" className="w-64">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <MessageSquare className="size-4" />
                            <span className="font-semibold">Conversations</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {conversations.map((conversation) => (
                                <SidebarMenuItem key={conversation.id}>
                                    <Link href={`/chat/${conversation.id}`} className="w-full">
                                        <SidebarMenuButton
                                            isActive={currentId === conversation.id}
                                            className="justify-between py-3 h-auto w-full"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="relative flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                        <MessageSquare className="h-5 w-5" />
                                                    </div>
                                                    {conversation.isOnline && (
                                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                                                    )}
                                                    {conversation.unreadCount > 0 && (
                                                        <div className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                                                            {conversation.unreadCount}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className="truncate font-medium">{conversation.name}</span>
                                                        <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground">
                                                            {conversation.timestamp}
                                                        </span>
                                                    </div>
                                                    <span className="block truncate text-sm text-muted-foreground">
                                                        {conversation.lastMessage}
                                                    </span>
                                                </div>
                                            </div>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

