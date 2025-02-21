import { CharacterResponse } from "@/types/character";
import { MessageResponse } from "@/types/message";

export interface ConversationCreate {
    title: string;
    character_ids: string[];
}

export interface ConversationUpdate {
    title?: string;
}

export interface ConversationResponse {
    id: string;
    title?: string;
    created_at: string;
    updated_at?: string;
    characters: CharacterResponse[];
    messages: MessageResponse[];
}
