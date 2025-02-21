"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, Users } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface Message {
    user: string
    content: string
    timestamp: string
    isCurrentUser: boolean
    avatarColor?: string
}

interface ChatInterfaceProps {
    sessionId: string
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        // Create a new WebSocket connection to your FastAPI endpoint
        wsRef.current = new WebSocket(`ws://localhost:8000/chat/${sessionId}`)

        wsRef.current.onopen = () => {
            console.log("Connected to the WebSocket server")
        }

        wsRef.current.onmessage = (event) => {
            try {
                const data: Message = JSON.parse(event.data)
                // Update the message list with the new incoming message
                setMessages((prev) => [...prev, data])
            } catch (err) {
                console.error("Error parsing WebSocket message", err)
            }
        }

        wsRef.current.onclose = () => {
            console.log("WebSocket connection closed")
        }

        wsRef.current.onerror = (error) => {
            console.error("WebSocket error", error)
        }

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [sessionId])

    const handleSend = () => {
        if (!input.trim()) return

        const message: Message = {
            user: "CurrentUser", // Replace with actual current user data
            content: input,
            timestamp: new Date().toLocaleTimeString(),
            isCurrentUser: true,
            avatarColor: "bg-blue-600",
        }

        // Send the message via the WebSocket if it's open
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
            // Optionally update the local state immediately (optimistic update)
            setMessages((prev) => [...prev, message])
            setInput("")
        } else {
            console.error("WebSocket is not connected")
        }
    }

    return (
        <div className="flex-1 flex flex-col">
            {/* Mobile header with triggers */}
            <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
                <SidebarTrigger>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </SidebarTrigger>
                <div className="flex-1">
                    <h1 className="font-semibold">Chat Messages</h1>
                </div>
                <SidebarTrigger>
                    <Users className="h-6 w-6" />
                    <span className="sr-only">Toggle users sidebar</span>
                </SidebarTrigger>
            </header>

            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn("flex gap-2 max-w-[80%]", message.isCurrentUser && "flex-row-reverse ml-auto")}
                                >
                                    {!message.isCurrentUser && (
                                        <Avatar className={cn("h-8 w-8 flex-shrink-0", message.avatarColor)}>
                                            <AvatarFallback>{message.user[0]}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("space-y-2", message.isCurrentUser ? "mr-0" : "mr-auto")}>
                                        <div className={cn("flex items-center gap-2", message.isCurrentUser && "flex-row-reverse")}>
                                            <span className="text-sm font-medium">{message.user}</span>
                                            <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                                        </div>
                                        <div
                                            className={cn(
                                                "p-3 rounded-lg",
                                                message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted/50"
                                            )}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="min-h-[44px] max-h-32"
                            />
                            <Button className="px-8" onClick={handleSend}>Send</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}