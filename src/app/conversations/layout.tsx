import type React from "react"
import { ConversationsList } from "@/components/conversations-list"

export default function ConversationsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ConversationsList />
            {children}
        </>
    )
}

