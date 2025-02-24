import { Character } from "./character";

export interface FavoriteCharacter {
    id: string;
    user_id: string;
    character_id: string;
    created_at: string;
    updated_at?: string;
}

export interface FavoriteCharactersResponse {
    characters: Character[];
    total: number;
    page: number;
    limit: number;
}

export interface FavoriteCharacterResponse {
    character: Character;
}

export interface FavoriteCharacterCreateRequest {
    user_id: string;
    character_id: string;
}

export interface FavoriteCharacterCreateResponse {
    character: Character;
}

export interface FavoriteCharacterDeleteResponse {
    message: string;
}


// export interface Favorite {
//     id: string;
//     user_id: string;
//     character_id: string;
//     created_at: string;
//     updated_at?: string;
// }

// export interface FavoritesResponse {
//     favorites: Favorite[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface FavoriteResponse {
//     favorite: Favorite;
// }

// export interface FavoriteCreateRequest {
//     user_id: string;
//     character_id: string;
// }

// export interface FavoriteCreateResponse {
//     favorite: Favorite;
// }

// export interface FavoriteDeleteResponse {
//     message: string;
// }
