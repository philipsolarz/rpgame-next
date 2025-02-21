export interface MessageCreate {
    conversation_id: string;
    content: string;
    sender_character_id: string;
}

export interface MessageUpdate {
    content?: string;
}

export interface MessageResponse {
    id: string;
    content: string;
    conversation_id: string;
    sender_character_id: string;
    created_at: string;
    updated_at?: string;
}
