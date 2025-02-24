export interface CharacterTag {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at?: string;
}

export interface CharacterRole {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at?: string;
}

export interface Character {
    id: string;
    user_id: string;
    role_id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at?: string;
    tag_ids?: string[];
    role?: CharacterRole;
    tags?: CharacterTag[];
}

export interface CharactersResponse {
    characters: Character[];
    total: number;
    page: number;
    limit: number;
}

export interface CharacterResponse {
    character: Character;
}

export interface CharacterCreateRequest {
    user_id: string;
    name: string;
    description?: string;
    role_id: string;
    tag_ids?: string[];
}

export interface CharacterCreateResponse {
    character: Character;
}

export interface CharacterUpdateRequest {
    name?: string;
    description?: string;
    role_id?: string;
    tag_ids?: string[];
}

export interface CharacterUpdateResponse {
    character: Character;
}

export interface CharacterDeleteResponse {
    message: string;
}

// Character Role Schemas

export interface CharacterRoleCreateRequest {
    name: string;
    description?: string;
}

export interface CharacterRoleCreateResponse {
    role: CharacterRole;
}

export interface CharacterRoleUpdateRequest {
    name?: string;
    description?: string;
}

export interface CharacterRoleUpdateResponse {
    role: CharacterRole;
}

export interface CharacterRoleDeleteResponse {
    message: string;
}

export interface CharacterRolesResponse {
    roles: CharacterRole[];
    total: number;
    page: number;
    limit: number;
}

export interface CharacterRoleResponse {
    role: CharacterRole;
}

// Character Tag Schemas

export interface CharacterTagCreateRequest {
    name: string;
    description?: string;
}

export interface CharacterTagCreateResponse {
    tag: CharacterTag;
}

export interface CharacterTagUpdateRequest {
    name?: string;
    description?: string;
}

export interface CharacterTagUpdateResponse {
    tag: CharacterTag;
}

export interface CharacterTagDeleteResponse {
    message: string;
}

export interface CharacterTagsResponse {
    tags: CharacterTag[];
    total: number;
    page: number;
    limit: number;
}

export interface CharacterTagResponse {
    tag: CharacterTag;
}

export interface CharacterTagAddRequest {
    tag_id: string;
}



// import { User } from "@/types/user";

// export interface Character {
//     id: string;
//     user_id: string;
//     name: string;
//     description?: string;
//     created_at: string;
//     updated_at?: string;
//     role_id: string;
//     tag_ids: string[];

//     user?: User;
//     role?: CharacterRole;
//     tags?: CharacterTag[];
// }

// export interface CharacterTag {
//     id: string;
//     name: string;
//     description?: string;
//     created_at: string;
//     updated_at?: string;
// }

// export interface CharacterRole {
//     id: string;
//     name: string;
//     description?: string;
//     created_at: string;
//     updated_at?: string;
// }

// export interface CharactersResponse {
//     characters: Character[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface CharacterResponse {
//     character: Character;
// }

// export interface CharacterCreateRequest {
//     user_id: string;
//     name: string;
//     description?: string;
//     role_id: string;
//     tag_ids?: string[];
// }

// export interface CharacterCreateResponse {
//     character: Character;
// }

// export interface CharacterUpdateRequest {
//     name?: string;
//     description?: string;
//     role_id?: string;
//     tag_ids?: string[];
// }

// export interface CharacterUpdateResponse {
//     character: Character;
// }

// export interface CharacterDeleteResponse {
//     message: string;
// }

// // Character Role Interfaces
// export interface CharacterRoleCreateRequest {
//     name: string;
//     description?: string;
// }

// export interface CharacterRoleCreateResponse {
//     role: CharacterRole;
// }

// export interface CharacterRoleUpdateRequest {
//     name?: string;
//     description?: string;
// }

// export interface CharacterRoleUpdateResponse {
//     role: CharacterRole;
// }

// export interface CharacterRoleDeleteResponse {
//     message: string;
// }

// export interface CharacterRolesResponse {
//     roles: CharacterRole[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface CharacterRoleResponse {
//     role: CharacterRole;
// }

// // Character Tag Interfaces
// export interface CharacterTagCreateRequest {
//     name: string;
//     description?: string;
// }

// export interface CharacterTagCreateResponse {
//     tag: CharacterTag;
// }

// export interface CharacterTagUpdateRequest {
//     name?: string;
//     description?: string;
// }

// export interface CharacterTagUpdateResponse {
//     tag: CharacterTag;
// }

// export interface CharacterTagDeleteResponse {
//     message: string;
// }

// export interface CharacterTagsResponse {
//     tags: CharacterTag[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface CharacterTagResponse {
//     tag: CharacterTag;
// }

// export interface CharacterTagAddRequest {
//     tag_id: string;
// }