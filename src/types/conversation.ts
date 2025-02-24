export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    updated_at?: string;
}

export interface MessageCreateRequest {
    sender_id: string;
    content: string;
}

export interface MessageCreateResponse {
    message: Message;
}

export interface MessageUpdateRequest {
    content?: string;
}

export interface MessageUpdateResponse {
    message: Message;
}

export interface MessageResponse {
    message: Message;
}

export interface MessagesResponse {
    messages: Message[];
    total: number;
    page: number;
    limit: number;
}

export interface MessageDeleteResponse {
    message: string;
}

export interface Participant {
    id: string;
    conversation_id: string;
    character_id: string;
}

export interface ParticipantAddRequest {
    character_id: string;
}

export interface ParticipantAddResponse {
    participant: Participant;
}

export interface ParticipantResponse {
    participant: Participant;
}

export interface ParticipantsResponse {
    participants: Participant[];
    total: number;
    page: number;
    limit: number;
}

export interface ParticipantDeleteResponse {
    message: string;
}

export interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at?: string;
    participants?: Participant[];
    messages?: Message[];
}

export interface ConversationCreateRequest {
    title: string;
    participant_ids?: string[];
}

export interface ConversationCreateResponse {
    conversation: Conversation;
}

export interface ConversationUpdateRequest {
    title?: string;
}

export interface ConversationUpdateResponse {
    conversation: Conversation;
}

export interface ConversationResponse {
    conversation: Conversation;
}

export interface ConversationsResponse {
    conversations: Conversation[];
    total: number;
    page: number;
    limit: number;
}

export interface ConversationDeleteResponse {
    message: string;
}


// import { Character } from "@/types/character";
// import { Message } from "@/types/message";

// export interface Conversation {
//     id: string;
//     title: string;
//     created_at: string;
//     updated_at?: string;
//     message_ids: string[];
//     messages?: Message[];
//     participant_ids: string[];
//     participants?: Character[];
// }

// export interface ConversationsResponse {
//     conversations: Conversation[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface ConversationResponse {
//     conversation: Conversation;
// }

// export interface ConversationCreateRequest {
//     title: string;
//     participant_ids: string[];
// }

// export interface ConversationCreateResponse {
//     conversation: Conversation;
// }

// export interface ConversationUpdateRequest {
//     title?: string;
//     participant_ids?: string[];
// }

// export interface ConversationUpdateResponse {
//     conversation: Conversation;
// }

// export interface ConversationDeleteResponse {
//     message: string;
// }
