// lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { createClient } from '@/utils/supabase/server';

// Create an Axios instance with a base URL from environment variables
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(
    async (config) => {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getSession();
        const access_token = data.session?.access_token;
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    description?: string;
    account_type: string;
}

export interface Agent {
    id: string;
    name: string;
    model: string;
    description?: string;
    created_at: string;
    updated_at?: string;
}

export interface AgentCreate {
    name: string;
    model: string;
    description?: string;
}

export interface AgentUpdate {
    name?: string;
    model?: string;
    description?: string;
}

export interface AgentResponse extends Agent { }

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

// --- Character Roles ---
export interface CharacterRoleBase {
    role: string;
    description?: string;
}

export interface CharacterRoleCreate extends CharacterRoleBase { }

export interface CharacterRoleUpdate {
    role?: string;
    description?: string;
}

export interface CharacterRoleResponse extends CharacterRoleBase {
    id: string;
    created_at: string;
    updated_at?: string;
}

export interface CharacterTagBase {
    name: string;
    description?: string;
}

export interface CharacterTagCreate extends CharacterTagBase { }

export interface CharacterTagUpdate {
    name?: string;
    description?: string;
}

export interface CharacterTagResponse extends CharacterTagBase {
    id: string;
    created_at: string;
    updated_at?: string;
}

const users = {
    createUser: async (user: User): Promise<User> => {
        try {
            const response = await apiClient.post<User>('/users', user);
            return response.data;
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    getUser: async (userId: string): Promise<User> => {
        try {
            const response = await apiClient.get<User>(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },
    listUsers: async (skip = 0, limit = 20): Promise<User[]> => {
        try {
            const response = await apiClient.get<User[]>('/users', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing users:', error);
            throw error;
        }
    },
    updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
        try {
            const response = await apiClient.put<User>(`/users/${userId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
    deleteUser: async (userId: string): Promise<void> => {
        try {
            await apiClient.delete(`/users/${userId}`);
        } catch (error: any) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
    getUserConversations: async (
        userId: string,
        skip = 0,
        limit = 20
    ): Promise<ConversationResponse[]> => {
        try {
            const response = await apiClient.get<ConversationResponse[]>(`/users/${userId}/conversations`, {
                params: { skip, limit },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching user conversations:', error);
            throw error;
        }
    },
    getFavoriteCharacters: async (userId: string): Promise<CharacterResponse[]> => {
        try {
            const response = await apiClient.get<CharacterResponse[]>(`/users/${userId}/characters/favorites`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching favorite characters:', error);
            throw error;
        }
    },
    getCharacters: async (userId: string): Promise<CharacterResponse[]> => {
        try {
            const response = await apiClient.get<CharacterResponse[]>(`/users/${userId}/characters`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching characters:', error);
            throw error;
        }
    }
};

const agents = {
    createAgent: async (agent: Omit<AgentCreate, 'attributes'>): Promise<AgentResponse> => {
        try {
            const response = await apiClient.post<AgentResponse>('/agents', agent);
            return response.data;
        } catch (error: any) {
            console.error('Error creating agent:', error);
            throw error;
        }
    },
    getAgent: async (agentId: string): Promise<AgentResponse> => {
        try {
            const response = await apiClient.get<AgentResponse>(`/agents/${agentId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching agent:', error);
            throw error;
        }
    },
    listAgents: async (skip = 0, limit = 20): Promise<AgentResponse[]> => {
        try {
            const response = await apiClient.get<AgentResponse[]>('/agents', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing agents:', error);
            throw error;
        }
    },
    updateAgent: async (agentId: string, data: Partial<AgentResponse>): Promise<AgentResponse> => {
        try {
            const response = await apiClient.put<AgentResponse>(`/agents/${agentId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating agent:', error);
            throw error;
        }
    },
    deleteAgent: async (agentId: string): Promise<void> => {
        try {
            await apiClient.delete(`/agents/${agentId}`);
        } catch (error: any) {
            console.error('Error deleting agent:', error);
            throw error;
        }
    },
    searchAgents: async (searchTerm: string, skip = 0, limit = 20): Promise<AgentResponse[]> => {
        try {
            const response = await apiClient.get<AgentResponse[]>('/agents/search', { params: { search_term: searchTerm, skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error searching agents:', error);
            throw error;
        }
    },
};

const messages = {
    createMessage: async (data: MessageCreate): Promise<MessageResponse> => {
        try {
            const response = await apiClient.post<MessageResponse>('/messages', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating message:', error);
            throw error;
        }
    },
    getMessage: async (messageId: string): Promise<MessageResponse> => {
        try {
            const response = await apiClient.get<MessageResponse>(`/messages/${messageId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching message:', error);
            throw error;
        }
    },
    updateMessage: async (messageId: string, data: MessageUpdate): Promise<MessageResponse> => {
        try {
            const response = await apiClient.put<MessageResponse>(`/messages/${messageId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating message:', error);
            throw error;
        }
    },
    deleteMessage: async (messageId: string): Promise<void> => {
        try {
            await apiClient.delete(`/messages/${messageId}`);
        } catch (error: any) {
            console.error('Error deleting message:', error);
            throw error;
        }
    },
};

const conversations = {
    createConversation: async (data: ConversationCreate): Promise<ConversationResponse> => {
        try {
            const response = await apiClient.post<ConversationResponse>('/conversations', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    },
    getConversation: async (conversationId: string): Promise<ConversationResponse> => {
        try {
            const response = await apiClient.get<ConversationResponse>(`/conversations/${conversationId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    },
    listConversations: async (skip = 0, limit = 20): Promise<ConversationResponse[]> => {
        try {
            const response = await apiClient.get<ConversationResponse[]>('/conversations', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing conversations:', error);
            throw error;
        }
    },
    updateConversation: async (conversationId: string, data: ConversationUpdate): Promise<ConversationResponse> => {
        try {
            const response = await apiClient.put<ConversationResponse>(`/conversations/${conversationId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating conversation:', error);
            throw error;
        }
    },
    deleteConversation: async (conversationId: string): Promise<void> => {
        try {
            await apiClient.delete(`/conversations/${conversationId}`);
        } catch (error: any) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    },
    addCharacterToConversation: async (
        conversationId: string,
        characterId: string
    ): Promise<ConversationResponse> => {
        try {
            const response = await apiClient.post<ConversationResponse>(`/conversations/${conversationId}/add_character/${characterId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error adding character to conversation:', error);
            throw error;
        }
    },
    removeCharacterFromConversation: async (
        conversationId: string,
        characterId: string
    ): Promise<ConversationResponse> => {
        try {
            const response = await apiClient.post<ConversationResponse>(`/conversations/${conversationId}/remove_character/${characterId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error removing character from conversation:', error);
            throw error;
        }
    },
    getMessagesForConversation: async (
        conversationId: string,
        skip = 0,
        limit = 50,
        order = 'asc'
    ): Promise<MessageResponse[]> => {
        try {
            const response = await apiClient.get<MessageResponse[]>(`/conversations/${conversationId}/messages`, { params: { skip, limit, order } });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching messages for conversation:', error);
            throw error;
        }
    },
};

const characters = {
    createCharacter: async (data: CharacterCreate): Promise<CharacterResponse> => {
        try {
            const response = await apiClient.post<CharacterResponse>('/characters', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating character:', error);
            throw error;
        }
    },
    getCharacter: async (characterId: string): Promise<CharacterResponse> => {
        try {
            const response = await apiClient.get<CharacterResponse>(`/characters/${characterId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching character:', error);
            throw error;
        }
    },
    listCharacters: async (skip = 0, limit = 20): Promise<CharacterResponse[]> => {
        try {
            const response = await apiClient.get<CharacterResponse[]>('/characters', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing characters:', error);
            throw error;
        }
    },
    updateCharacter: async (characterId: string, data: CharacterUpdate): Promise<CharacterResponse> => {
        try {
            const response = await apiClient.put<CharacterResponse>(`/characters/${characterId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating character:', error);
            throw error;
        }
    },
    deleteCharacter: async (characterId: string): Promise<void> => {
        try {
            await apiClient.delete(`/characters/${characterId}`);
        } catch (error: any) {
            console.error('Error deleting character:', error);
            throw error;
        }
    },
    searchCharacters: async (
        params: {
            name?: string;
            role_id?: string;
            tag_ids?: string[];
            match_all_tags?: boolean;
            skip?: number;
            limit?: number;
        }
    ): Promise<CharacterResponse[]> => {
        try {
            const response = await apiClient.get<CharacterResponse[]>('/characters/search', { params });
            return response.data;
        } catch (error: any) {
            console.error('Error searching characters:', error);
            throw error;
        }
    },
};

/* ============================
   API Functions: Character Roles
   ============================ */
const characterRoles = {
    createRole: async (data: CharacterRoleCreate): Promise<CharacterRoleResponse> => {
        try {
            const response = await apiClient.post<CharacterRoleResponse>('/characters/roles', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating role:', error);
            throw error;
        }
    },
    getRole: async (roleId: string): Promise<CharacterRoleResponse> => {
        try {
            const response = await apiClient.get<CharacterRoleResponse>(`/characters/roles/${roleId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching role:', error);
            throw error;
        }
    },
    listRoles: async (skip = 0, limit = 20): Promise<CharacterRoleResponse[]> => {
        try {
            const response = await apiClient.get<CharacterRoleResponse[]>('/characters/roles', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing roles:', error);
            throw error;
        }
    },
    updateRole: async (roleId: string, data: CharacterRoleUpdate): Promise<CharacterRoleResponse> => {
        try {
            const response = await apiClient.put<CharacterRoleResponse>(`/characters/roles/${roleId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating role:', error);
            throw error;
        }
    },
    deleteRole: async (roleId: string): Promise<void> => {
        try {
            await apiClient.delete(`/characters/roles/${roleId}`);
        } catch (error: any) {
            console.error('Error deleting role:', error);
            throw error;
        }
    },
};

const characterTags = {
    createTag: async (data: CharacterTagCreate): Promise<CharacterTagResponse> => {
        try {
            const response = await apiClient.post<CharacterTagResponse>('/characters/tags', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating tag:', error);
            throw error;
        }
    },
    getTag: async (tagId: string): Promise<CharacterTagResponse> => {
        try {
            const response = await apiClient.get<CharacterTagResponse>(`/characters/tags/${tagId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching tag:', error);
            throw error;
        }
    },
    listTags: async (skip = 0, limit = 20): Promise<CharacterTagResponse[]> => {
        try {
            const response = await apiClient.get<CharacterTagResponse[]>('/characters/tags', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing tags:', error);
            throw error;
        }
    },
    updateTag: async (tagId: string, data: CharacterTagUpdate): Promise<CharacterTagResponse> => {
        try {
            const response = await apiClient.put<CharacterTagResponse>(`/characters/tags/${tagId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating tag:', error);
            throw error;
        }
    },
    deleteTag: async (tagId: string): Promise<void> => {
        try {
            await apiClient.delete(`/characters/tags/${tagId}`);
        } catch (error: any) {
            console.error('Error deleting tag:', error);
            throw error;
        }
    },
};

const api = {
    users,
    agents,
    characters,
    messages,
    conversations,
};

export default api;
