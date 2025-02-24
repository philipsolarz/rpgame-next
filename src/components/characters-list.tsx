"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { MyCharactersList } from "./my-characters-list"
import { FavoriteCharactersList } from "./favorite-characters-list"
import { ExploreCharactersList } from "./explore-characters-list"
import { User } from "@/types"

export function CharactersList({ user }: { user: User }) {
    return (
        <Sidebar collapsible="none" className="w-[300px] border-r" style={{ height: "calc(100vh - var(--header-height))" }}>
            <SidebarHeader className="border-b p-4">
                <Button variant="secondary" className="w-full" size="sm" asChild>
                    <Link href="/characters/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Character
                    </Link>
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <MyCharactersList user={user} />
                <FavoriteCharactersList user={user} />
                <ExploreCharactersList user={user} />
            </SidebarContent>
        </Sidebar>
    )
}

