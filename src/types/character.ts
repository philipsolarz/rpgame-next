import { CharacterRoleResponse } from "@/types/characterRole";
import { CharacterTagResponse } from "@/types/characterTag";

export interface CharacterBase {
    name: string;
    role_id: string;
    avatar?: string;
    bio?: string;
    attributes?: Record<string, any>;
    user_id?: string;
    agent_id?: string;
    tag_ids?: string[];
}

export interface CharacterCreate extends CharacterBase { }

export interface CharacterUpdate {
    name?: string;
    role_id?: string;
    avatar?: string;
    bio?: string;
    attributes?: Record<string, any>;
    tag_ids?: string[];
}

export interface CharacterResponse extends CharacterBase {
    id: string;
    created_at: string;
    updated_at?: string;
    role: CharacterRoleResponse;
    tags: CharacterTagResponse[];
}
