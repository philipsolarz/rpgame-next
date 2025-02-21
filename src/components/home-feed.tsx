"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, MoreHorizontal, Share } from "lucide-react"
import { Menu, Users } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface FeedItem {
    id: number
    user: {
        name: string
        avatar: string
        username: string
    }
    content: string
    image?: string
    likes: number
    comments: number
    timestamp: string
}

export function HomeFeed() {
    const [items, setItems] = React.useState<FeedItem[]>([])
    const [loading, setLoading] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Generate a feed item
    const generateFeedItem = (id: number): FeedItem => ({
        id,
        user: {
            name: `User ${id}`,
            avatar: `/placeholder.svg?height=40&width=40`,
            username: `user${id}`,
        },
        content: `This is a sample post ${id} with some interesting content. What do you think about this?`,
        image: id % 2 === 0 ? `/placeholder.svg?height=400&width=600` : undefined,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
    })

    // Load initial items
    React.useEffect(() => {
        const initialItems = Array.from({ length: 10 }, (_, i) => generateFeedItem(i + 1))
        setItems(initialItems)
    }, []) // Removed generateFeedItem from dependencies

    // Infinite scroll handler
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    loadMore()
                }
            },
            { threshold: 0.1 },
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [loading])

    const loadMore = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const newItems = Array.from({ length: 5 }, (_, i) => generateFeedItem(items.length + i + 1))
        setItems((prev) => [...prev, ...newItems])
        setLoading(false)
    }

    return (
        <div className="flex-1 flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
                <SidebarTrigger>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </SidebarTrigger>
                <div className="flex-1">
                    <h1 className="font-semibold">Home Feed</h1>
                </div>
                <SidebarTrigger>
                    <Users className="h-6 w-6" />
                    <span className="sr-only">Toggle users sidebar</span>
                </SidebarTrigger>
            </header>

            <div className="flex-1 overflow-auto">
                <div className="container max-w-2xl mx-auto py-4">
                    {items.map((item) => (
                        <Card key={item.id} className="mb-4">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <Avatar>
                                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                                    <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-semibold">{item.user.name}</div>
                                    <div className="text-sm text-muted-foreground">@{item.user.username}</div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>{item.content}</p>
                                {item.image && (
                                    <div className="rounded-lg overflow-hidden">
                                        <img src={item.image || "/placeholder.svg"} alt="Post content" className="w-full" />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="ghost" size="sm">
                                    <Heart className="h-4 w-4 mr-2" />
                                    {item.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    {item.comments}
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <div ref={containerRef} className="h-10">
                        {loading && <div className="text-center text-muted-foreground">Loading more posts...</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

