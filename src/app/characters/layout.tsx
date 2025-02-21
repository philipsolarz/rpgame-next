import type React from "react"
import { CharactersList } from "@/components/characters-list"
import { createClient } from "@/utils/supabase/server"
import api from "@/lib/api"

export default async function CharactersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
        console.error(userError)
        return <div>Something went wrong</div>
    }

    if (!userData) {
        return <div>Loading...</div>
    }

    const myCharactersData = await api.characters.listCharacters()
    const favoriteCharactersData = await api.users.getFavoriteCharacters(userData.user.id)
    const exploreCharactersData = await api.characters.searchCharacters({})

    return (
        <>
            <CharactersList
                myCharacters={myCharactersData}
                favoriteCharacters={favoriteCharactersData}
                exploreCharacters={exploreCharactersData}
            />
            {children}
        </>
    )
}

