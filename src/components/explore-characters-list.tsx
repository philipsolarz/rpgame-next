"use client"

import * as React from "react"
import {
    ChevronDown,
    Sparkles,
    Search,
    MessageSquareMore,
    Share2,
    Heart,
    Flag,
    X,
    User as UserIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupContent,
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
import { Character, CharactersResponse, CharacterTag, CharacterTagResponse, CharacterTagsResponse, User } from "@/types"
import { useCallback, useEffect, useState } from "react"

export function ExploreCharactersList({ user }: { user: User }) {
    const pathname = usePathname()

    // States for character list
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<CharacterTag[]>([])
    const [characters, setCharacters] = useState<Character[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // States for tags list (fetched from /api/characters/tags)
    const [tags, setTags] = useState<CharacterTag[]>([])
    const [isLoadingTags, setIsLoadingTags] = useState(false)
    const [tagsError, setTagsError] = useState<string | null>(null)

    // Helper: debounce function to delay search execution
    function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout
        return (...args: Parameters<T>) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    // Fetch characters based on current page, search query, and selected tags
    async function fetchCharacters(pageNum: number, query: string, tagsFilter: CharacterTag[]) {
        try {
            setIsLoading(true)
            setError(null)
            const tagsFilterIds = tagsFilter.map(tag => tag.id)
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: "8",
                ...(query ? { name: query } : {}),
                // ...(tagsFilter.length ? { tag_ids: tagsFilterIds.join(",") } : {}),
            })
            tagsFilter.forEach(tag => params.append("tag_ids", tag.id));
            const response = await fetch(
                `/api/characters?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                },
            )
            if (!response.ok) throw new Error("Failed to fetch characters")
            const charactersResponse: CharactersResponse = await response.json()
            // Assume the API returns { items: Character[], totalPages: number }
            setCharacters(charactersResponse.characters)
            const total = charactersResponse.total
            const totalPages = Math.ceil(total / 8)
            setTotalPages(totalPages)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    // Debounced search so that we don't call the API on every key stroke
    const debouncedFetch = useCallback(
        debounce((query: string, tagsFilter: CharacterTag[]) => {
            setPage(1)
            fetchCharacters(1, query, tagsFilter)
        }, 300),
        [],
    )

    // When search query or selected tags change, run debounced fetch
    useEffect(() => {
        debouncedFetch(searchQuery, selectedTags)
    }, [searchQuery, selectedTags, debouncedFetch])

    // When page changes, fetch characters with the current filters
    useEffect(() => {
        fetchCharacters(page, searchQuery, selectedTags)
    }, [page])

    // Fetch available tags from the API endpoint
    async function fetchTags() {
        try {
            setIsLoadingTags(true)
            setTagsError(null)
            const params = new URLSearchParams({
                page: "1",
                limit: "10",
            })
            const response = await fetch(
                `/api/characters/tags?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )
            console.log(response)
            if (!response.ok) throw new Error("Failed to fetch tags")
            const characterTagsResponse: CharacterTagsResponse = await response.json()
            // Assume the API returns { tags: string[] } or { items: string[] }
            const characterTags = characterTagsResponse.tags
            setTags(characterTags)
        } catch (err) {
            setTagsError(err instanceof Error ? err.message : "Failed to fetch tags")
        } finally {
            setIsLoadingTags(false)
        }
    }

    // Fetch tags when the component mounts
    useEffect(() => {
        fetchTags()
    }, [])

    // Handlers for tag selection and removal
    const handleAddTag = (tag: CharacterTag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags((prev) => [...prev, tag])
        }
    }

    const handleRemoveTag = (tag: CharacterTag) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag))
    }

    return (
        <SidebarGroup>
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center px-4 py-2 hover:bg-muted/50">
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Explore Characters</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        {/* Search Input */}
                        <div className="px-4 py-2">
                            <Input
                                placeholder="Search characters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tag Filtering */}
                        <div className="px-4 py-2">
                            {selectedTags.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-1">
                                    {selectedTags.map((tag) => (
                                        <Badge key={tag.id} variant="default" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                                            {tag.name} <X className="ml-1 h-3 w-3" />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {isLoadingTags ? (
                                <div className="text-sm text-muted-foreground">Loading tags...</div>
                            ) : tagsError ? (
                                <div className="text-sm text-red-500">{tagsError}</div>
                            ) : (
                                <div className="flex flex-wrap gap-1">
                                    {tags
                                        .filter((tag) => !selectedTags.includes(tag))
                                        .map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-secondary/80"
                                                onClick={() => handleAddTag(tag)}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Character List */}
                        <div className="px-2 py-1">
                            {isLoading ? (
                                <div className="p-4 text-sm text-muted-foreground">Loading characters...</div>
                            ) : error ? (
                                <div className="p-4 text-sm text-red-500">{error}</div>
                            ) : (
                                <SidebarMenu>
                                    {characters.map((character) => (
                                        <CharacterItem
                                            key={character.id}
                                            character={character}
                                        />
                                    ))}
                                </SidebarMenu>
                            )}
                        </div>

                        {/* Simple Pagination Controls */}
                        <div className="flex items-center justify-between px-4 py-2">
                            <Button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {page} of {totalPages}
                            </span>
                            <Button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                                Next
                            </Button>
                        </div>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    )
}

type CharacterItemProps = {
    character: Character;
}

function CharacterItem({ character }: CharacterItemProps) {
    const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)

    const handleAddToFavorites = async () => {
        try {
            setIsAddingToFavorites(true)
            const response = await fetch(`/api/users/0/favorites/${character.id}`, {
                method: "POST",
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to add to favorites")
            }
            console.log("Added to favorites")
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Failed to add to favorites")
        } finally {
            setIsAddingToFavorites(false)
        }
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={`/characters/${character.id}`}>
                            <Avatar className="h-8 w-8">
                                {/* <AvatarImage src={"/placeholder.svg?height=32&width=32"} alt={character.name} /> */}
                                <AvatarFallback>
                                    <UserIcon className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <span className="text-sm">{character.name}</span>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {character.role?.name}
                                    </Badge>
                                    {/* <span className="text-xs text-muted-foreground">{character.created_at}</span> */}
                                </div>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuItem>
                    <MessageSquareMore className="mr-2 h-4 w-4" />
                    Invite to Conversation
                </ContextMenuItem>
                <ContextMenuItem disabled={isAddingToFavorites} onClick={handleAddToFavorites}>
                    <Heart className="mr-2 h-4 w-4" />
                    {isAddingToFavorites ? "Adding to Favorites..." : "Add to Favorites"}
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
            </ContextMenuContent>
        </ContextMenu>
    )
}
