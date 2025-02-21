import type React from "react";
import { CharactersList } from "@/components/characters-list";
import { fetchUser, fetchUserCharacters, fetchFavoriteCharacters } from "./actions";

export default async function CharactersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, error } = await fetchUser();

    if (error) {
        return <div>Something went wrong</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    const myCharactersData = await fetchUserCharacters(user.id);
    const favoriteCharactersData = await fetchFavoriteCharacters(user.id);

    return (
        <>
            <CharactersList
            // myCharacters={myCharactersData}
            // favoriteCharacters={favoriteCharactersData}
            // exploreCharacters={myCharactersData}
            />
            {children}
        </>
    );
}
