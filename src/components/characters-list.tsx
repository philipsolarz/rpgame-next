"use client"

import * as React from "react"
import {
    ChevronDown,
    Heart,
    Plus,
    Search,
    Star,
    Sparkles,
    User,
    Users,
    X,
    Flag,
    Edit,
    MessageSquareMore,
    Share2,
    Trash2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
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
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useAuthToken } from "@/hooks/useAuthToken"
import { CharacterResponse } from "@/lib/api"

export function CharactersList() {
    const pathname = usePathname()
    const token = useAuthToken()

    const [loading, setLoading] = React.useState(true)
    const [myCharacters, setMyCharacters] = React.useState<CharacterResponse[]>([])
    const [favoriteCharacters, setFavoriteCharacters] = React.useState<CharacterResponse[]>([])
    const [exploreCharacters, setExploreCharacters] = React.useState<CharacterResponse[]>([])

    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedTags, setSelectedTags] = React.useState<string[]>([])
    const [showMoreTags, setShowMoreTags] = React.useState(false)

    React.useEffect(() => {
        async function fetchCharacters() {
            if (!token) return

            try {
                setLoading(true)
                const API_BASE = process.env.NEXT_PUBLIC_API_URL
                const [myRes, favRes, exploreRes] = await Promise.all([
                    fetch(`${API_BASE}/characters`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE}/characters/favorites`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE}/characters/search`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ])

                if (!myRes.ok || !favRes.ok || !exploreRes.ok) {
                    throw new Error("Failed to fetch one or more character lists")
                }

                const myData = await myRes.json()
                const favData = await favRes.json()
                const exploreData = await exploreRes.json()

                setMyCharacters(myData)
                setFavoriteCharacters(favData)
                setExploreCharacters(exploreData)
            } catch (error) {
                console.error("Error fetching characters:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCharacters()
    }, [token])

    if (loading) {
        return <div>Loading...</div> // Optionally, replace with a Skeleton component.
    }

    // Filter based on the search query.
    const filteredMyCharacters = myCharacters.filter((char) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const filteredFavorites = favoriteCharacters.filter((char) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // For explore characters, also filter based on selected tags.
    const filteredExploreCharacters = exploreCharacters.filter((char) => {
        const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase())
        const tagNames = char.tags.map((tag) => tag.name)
        const matchesTags =
            selectedTags.length === 0 || selectedTags.every((tag) => tagNames.includes(tag))
        return matchesSearch && matchesTags
    })

    // Calculate initial tag counts (based on exploreCharacters) from tag objects.
    const initialTagCounts: Record<string, number> = {}
    exploreCharacters.forEach((char) => {
        char.tags.forEach((tagObj) => {
            const tag = tagObj.name
            initialTagCounts[tag] = (initialTagCounts[tag] || 0) + 1
        })
    })

    const availableTags = React.useMemo(() => {
        const tagCounts: Record<string, number> = {}
        filteredExploreCharacters.forEach((char) => {
            char.tags.forEach((tagObj) => {
                const tag = tagObj.name
                if (!selectedTags.includes(tag)) {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1
                }
            })
        })
        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([tag]) => tag)
    }, [filteredExploreCharacters, selectedTags])

    const visibleTags = showMoreTags ? availableTags.slice(0, 8) : availableTags.slice(0, 4)

    const handleTagClick = (tag: string) => {
        setSelectedTags((prev) => [...prev, tag])
        setShowMoreTags(false)
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove))
    }

    return (
        <Sidebar
            collapsible="none"
            className="w-[300px] border-r"
            style={{ height: "calc(100vh - var(--header-height))" }}
        >
            <SidebarHeader className="border-b p-4">
                <Button variant="secondary" className="w-full" size="sm" asChild>
                    <Link href="/characters/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Character
                    </Link>
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center px-4 py-2 hover:bg-muted/50">
                            <Users className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">My Characters</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {filteredMyCharacters.map((character) => (
                                        <CharacterItem
                                            key={character.id}
                                            character={character}
                                            isActive={pathname === `/characters/${character.id}`}
                                            variant="my-character"
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>

                <SidebarGroup>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center px-4 py-2 hover:bg-muted/50">
                            <Heart className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">Favorites</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {filteredFavorites.map((character) => (
                                        <CharacterItem
                                            key={character.id}
                                            character={character}
                                            isActive={pathname === `/characters/${character.id}`}
                                            variant="favorite"
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>

                <SidebarGroup>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center px-4 py-2 hover:bg-muted/50">
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">Explore Characters</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <div className="relative px-4 py-2">
                                    <Search className="absolute left-6 top-[1.125rem] h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search characters..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="px-4 py-2">
                                    {selectedTags.length > 0 && (
                                        <div className="mb-2 flex flex-wrap gap-1">
                                            {selectedTags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="default"
                                                    className="cursor-pointer"
                                                    onClick={() => handleRemoveTag(tag)}
                                                >
                                                    {tag}
                                                    <X className="ml-1 h-3 w-3" />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-1">
                                        {visibleTags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-secondary/80"
                                                onClick={() => handleTagClick(tag)}
                                            >
                                                {tag} ({initialTagCounts[tag]})
                                            </Badge>
                                        ))}
                                        {availableTags.length > 4 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs"
                                                onClick={() => setShowMoreTags((prev) => !prev)}
                                            >
                                                {showMoreTags ? "Show less" : `+${availableTags.length - 4} more`}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="px-2 py-1">
                                    <SidebarMenu>
                                        {filteredExploreCharacters.map((character) => (
                                            <CharacterItem
                                                key={character.id}
                                                character={character}
                                                isActive={pathname === `/characters/${character.id}`}
                                                variant="explore"
                                            />
                                        ))}
                                    </SidebarMenu>
                                </div>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

type CharacterItemProps = {
    character: CharacterResponse
    isActive: boolean
    variant?: "my-character" | "favorite" | "explore"
}

function CharacterItem({ character, isActive, variant = "my-character" }: CharacterItemProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={`/characters/${character.id}`}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={character.avatar || "/placeholder.svg?height=32&width=32"}
                                    alt={character.name}
                                />
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="text-sm">{character.name}</span>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {typeof character.role === "object" ? character.role.role : character.role}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {character.updated_at || character.created_at}
                                    </span>
                                </div>
                            </div>
                            {variant === "favorite" && <Star className="ml-auto h-4 w-4 text-yellow-500" />}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                {variant === "my-character" && (
                    <>
                        <ContextMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Character
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Character
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Character
                        </ContextMenuItem>
                    </>
                )}
                {variant === "favorite" && (
                    <>
                        <ContextMenuItem>
                            <MessageSquareMore className="mr-2 h-4 w-4" />
                            Invite to Conversation
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Character
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem className="text-red-600">
                            <X className="mr-2 h-4 w-4" />
                            Remove from Favorites
                        </ContextMenuItem>
                    </>
                )}
                {variant === "explore" && (
                    <>
                        <ContextMenuItem>
                            <MessageSquareMore className="mr-2 h-4 w-4" />
                            Invite to Conversation
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Heart className="mr-2 h-4 w-4" />
                            Add to Favorites
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Character
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem className="text-red-600">
                            <Flag className="mr-2 h-4 w-4" />
                            Report Character
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}
