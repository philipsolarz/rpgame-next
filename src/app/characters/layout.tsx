import type React from "react";
import { CharactersList } from "@/components/characters-list";
import { createClient } from '@/utils/supabase/server'
import { headers } from "next/headers";
import { User, UserResponse } from "@/types";

export default async function CharactersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
        return null;
    }

    const cookieHeader = (await headers()).get("cookie");
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/api/users/${userData.user.id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader || "",
            },
            cache: "no-store"
        }
    );
    const userResponse: UserResponse = await response.json();
    const user: User = userResponse.user;

    return (
        <>
            <CharactersList
                user={user}
            />
            {children}
        </>
    );
}
