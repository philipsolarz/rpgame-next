"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Edit, Share2, Trash2, User as UserIcon, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { DeleteCharacterDialog } from "./delete-character-dialog";

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
                        {isLoading ? (
                            <div className="p-2 space-y-2">
                                {Array(3).fill(0).map((_, index) => (
                                    <div key={index} className="flex items-center gap-2 px-2 py-1.5">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                    </SidebarGroupContent>
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    );
}

type CharacterItemProps = {
    character: Character;
};

function CharacterItem({ character }: CharacterItemProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeletingCharacter, setIsDeletingCharacter] = useState(false);

    const handleEditCharacter = () => {
        router.push(`/characters/${character.id}/edit`);
    };

    const handleDeleteCharacter = async () => {
        try {
            setIsDeletingCharacter(true);

            const response = await fetch(`/api/characters/${character.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete character");
            }

            // Refresh the page or list after successful deletion
            router.refresh();

        } catch (error) {
            console.error("Error deleting character:", error);
            throw error;
        } finally {
            setIsDeletingCharacter(false);
        }
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={`/characters/${character.id}`}>
                                <Avatar className="h-8 w-8">
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
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-52">
                    <ContextMenuItem onClick={handleEditCharacter}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Character
                    </ContextMenuItem>
                    <ContextMenuItem disabled className="text-muted-foreground">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Character
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Character
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <DeleteCharacterDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                character={character}
                onConfirm={handleDeleteCharacter}
            />
        </>
    );
}