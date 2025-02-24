import { Character } from './character';
import { FavoriteCharacter } from './favorite';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at?: string;
    account_type: string;
    is_admin: boolean;
    characters?: Character[];
    favorite_characters?: FavoriteCharacter[];
}

export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface UserResponse {
    user: User;
}

export interface UserCreateRequest {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface UserCreateResponse {
    user: User;
}

export interface UserUpdateRequest {
    first_name?: string;
    last_name?: string;
    account_type?: string;
    is_admin?: boolean;
}

export interface UserUpdateResponse {
    user: User;
}

export interface UserDeleteResponse {
    message: string;
}




// export interface User {
//     id: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     description?: string;
//     account_type: string;
//     created_at: string;
//     updated_at?: string;
// }

// export interface UsersResponse {
//     users: User[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface UserResponse {
//     user: User;
// }

// export interface UserCreateRequest {
//     email: string;
//     password: string;
//     first_name: string;
//     last_name: string;
//     description?: string;
//     account_type?: string;
// }

// export interface UserCreateResponse {
//     user: User;
// }

// export interface UserUpdateRequest {
//     first_name?: string;
//     last_name?: string;
//     description?: string;
//     account_type?: string;
// }

// export interface UserUpdateResponse {
//     user: User;
// }

// export interface UserDeleteResponse {
//     message: string;
// }
