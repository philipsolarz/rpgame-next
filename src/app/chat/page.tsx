import { ChatUsersSidebar } from "@/components/chatusers-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const users = [
    { name: "Alice", avatarColor: "bg-slate-600", isOnline: true },
    { name: "Bob", avatarColor: "bg-green-600", isOnline: true },
    { name: "Charlie", avatarColor: "bg-amber-600", isOnline: true },
    { name: "David", avatarColor: "bg-blue-600", isOnline: false },
    { name: "Eve", avatarColor: "bg-purple-600", isOnline: false },
]

export default async function MessagesPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    return (
        <div className="flex-1 flex">
            Private site
            {/* <ChatInterface /> */}
            <ChatUsersSidebar users={users} />
        </div>
    )
}
