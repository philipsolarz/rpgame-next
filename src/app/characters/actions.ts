import { createClient } from "@/utils/supabase/server";
import server_api from "@/lib/api/server";

export async function fetchUser() {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error(userError);
        return { user: null, error: userError };
    }

    return { user: userData?.user, error: null };
}

export async function fetchUserCharacters(userId: string) {
    return await server_api.users.getCharacters(userId);
}

export async function fetchFavoriteCharacters(userId: string) {
    return await server_api.users.getFavoriteCharacters(userId);
}
