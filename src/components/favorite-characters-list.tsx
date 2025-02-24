"use client"

import { useEffect, useState } from "react";
import { ChevronDown, Heart, MessageSquareMore, Share2, Star, User as UserIcon, X } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Character, CharactersResponse, User } from "@/types"

export function FavoriteCharactersList({ user }: { user: User }) {

    const [characters, setCharacters] = useState<Character[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const params = new URLSearchParams({ user_id: user.id, limit: "5" });
                const response = await fetch(`/api/characters/favorites?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch characters");
                const charactersResponse: CharactersResponse = await response.json();
                setCharacters(charactersResponse.characters);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCharacters();
    }, [user.id]);

    if (error) {
        return <div className="p-4 text-sm text-red-500">{error}</div>;
    }

    if (isLoading) {
        return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
    }

    return (
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
                            {characters.map((character) => (
                                <CharacterItem
                                    key={character.id}
                                    character={character}
                                    user={user}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    )
}

type CharacterItemProps = {
    character: Character;
    user: User;
    // isActive: boolean;
};

// type CharacterItemProps = {
//     character: {
//         id: string
//         name: string
//         role: string
//         avatar?: string
//         created_at?: string
//     }
//     isActive: boolean,
//     userId: string | undefined
// }

function CharacterItem({ character, user }: CharacterItemProps) {
    const [isRemoving, setIsRemoving] = useState(false)

    const handleRemoveFromFavorites = async () => {
        try {
            setIsRemoving(true)
            const response = await fetch(`/api/favorites/${character.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to remove from favorites")
            }
            console.log("Removed from favorites")
            // toast.success("Removed from favorites")
            // In a real app, you would want to refresh the favorites list here
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Failed to remove from favorites")
            // toast.error(error instanceof Error ? error.message : "Failed to remove from favorites")
        } finally {
            setIsRemoving(false)
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
                                        {character.role?.name || character.role_id}
                                    </Badge>
                                    {/* <span className="text-xs text-muted-foreground">{character.created_at}</span> */}
                                </div>
                            </div>
                            <Star className="ml-auto h-4 w-4 text-yellow-500" />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuItem>
                    <MessageSquareMore className="mr-2 h-4 w-4" />
                    Invite to Conversation
                </ContextMenuItem>
                <ContextMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Character
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-red-600" disabled={isRemoving} onClick={handleRemoveFromFavorites}>
                    <X className="mr-2 h-4 w-4" />
                    {isRemoving ? "Removing..." : "Remove from Favorites"}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

