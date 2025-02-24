"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Edit, Share2, Trash2, User as UserIcon, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CharactersResponse, Character, User } from "@/types";

export function MyCharactersList({ user }: { user: User }) {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const params = new URLSearchParams({ user_id: user.id, limit: "5" });
                const response = await fetch(`/api/characters?${params.toString()}`, {
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
                    <Users className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">My Characters</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {characters.map((character) => (
                                <CharacterItem
                                    key={character.id}
                                    character={character}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    );
}

type CharacterItemProps = {
    character: Character;
    // isActive: boolean;
};

// function CharacterItem({ character, isActive }: CharacterItemProps) {
function CharacterItem({ character }: CharacterItemProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={`/characters/${character.id}`}>
                            <Avatar className="h-8 w-8">
                                {/* <AvatarImage
                                    // src={character.avatar || "/placeholder.svg?height=32&width=32"}
                                    src="/placeholder.svg?height=32&width=32"
                                    alt={character.name}
                                /> */}
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
                                    {/* <span className="text-xs text-muted-foreground">{character.updated_at}</span> */}
                                </div>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
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
            </ContextMenuContent>
        </ContextMenu>
    );
}
