import axios, { AxiosInstance } from 'axios';
import { createClient } from '@/utils/supabase/server';
import { User, Agent, MessageResponse, ConversationResponse, CharacterResponse, AgentCreate, AgentResponse, MessageCreate, MessageUpdate, ConversationUpdate, CharacterCreate, CharacterUpdate, ConversationCreate, CharacterRoleCreate, CharacterRoleResponse, CharacterRoleUpdate, CharacterTagCreate, CharacterTagResponse, CharacterTagUpdate } from "@/types";

const apiServer: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiServer.interceptors.request.use(
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

const users = {
    createUser: async (user: User): Promise<User> => {
        try {
            const response = await apiServer.post<User>('/users', user);
            return response.data;
        } catch (error: any) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    getUser: async (userId: string): Promise<User> => {
        try {
            const response = await apiServer.get<User>(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },
    listUsers: async (skip = 0, limit = 20): Promise<User[]> => {
        try {
            const response = await apiServer.get<User[]>('/users', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing users:', error);
            throw error;
        }
    },
    updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
        try {
            const response = await apiServer.put<User>(`/users/${userId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
    deleteUser: async (userId: string): Promise<void> => {
        try {
            await apiServer.delete(`/users/${userId}`);
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
            const response = await apiServer.get<ConversationResponse[]>(`/users/${userId}/conversations`, {
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
            const response = await apiServer.get<CharacterResponse[]>(`/users/${userId}/characters/favorites`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching favorite characters:', error);
            throw error;
        }
    },
    getCharacters: async (userId: string): Promise<CharacterResponse[]> => {
        try {
            const response = await apiServer.get<CharacterResponse[]>(`/users/${userId}/characters`);
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
            const response = await apiServer.post<AgentResponse>('/agents', agent);
            return response.data;
        } catch (error: any) {
            console.error('Error creating agent:', error);
            throw error;
        }
    },
    getAgent: async (agentId: string): Promise<AgentResponse> => {
        try {
            const response = await apiServer.get<AgentResponse>(`/agents/${agentId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching agent:', error);
            throw error;
        }
    },
    listAgents: async (skip = 0, limit = 20): Promise<AgentResponse[]> => {
        try {
            const response = await apiServer.get<AgentResponse[]>('/agents', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing agents:', error);
            throw error;
        }
    },
    updateAgent: async (agentId: string, data: Partial<AgentResponse>): Promise<AgentResponse> => {
        try {
            const response = await apiServer.put<AgentResponse>(`/agents/${agentId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating agent:', error);
            throw error;
        }
    },
    deleteAgent: async (agentId: string): Promise<void> => {
        try {
            await apiServer.delete(`/agents/${agentId}`);
        } catch (error: any) {
            console.error('Error deleting agent:', error);
            throw error;
        }
    },
    searchAgents: async (searchTerm: string, skip = 0, limit = 20): Promise<AgentResponse[]> => {
        try {
            const response = await apiServer.get<AgentResponse[]>('/agents/search', { params: { search_term: searchTerm, skip, limit } });
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
            const response = await apiServer.post<MessageResponse>('/messages', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating message:', error);
            throw error;
        }
    },
    getMessage: async (messageId: string): Promise<MessageResponse> => {
        try {
            const response = await apiServer.get<MessageResponse>(`/messages/${messageId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching message:', error);
            throw error;
        }
    },
    updateMessage: async (messageId: string, data: MessageUpdate): Promise<MessageResponse> => {
        try {
            const response = await apiServer.put<MessageResponse>(`/messages/${messageId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating message:', error);
            throw error;
        }
    },
    deleteMessage: async (messageId: string): Promise<void> => {
        try {
            await apiServer.delete(`/messages/${messageId}`);
        } catch (error: any) {
            console.error('Error deleting message:', error);
            throw error;
        }
    },
};

const conversations = {
    createConversation: async (data: ConversationCreate): Promise<ConversationResponse> => {
        try {
            const response = await apiServer.post<ConversationResponse>('/conversations', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    },
    getConversation: async (conversationId: string): Promise<ConversationResponse> => {
        try {
            const response = await apiServer.get<ConversationResponse>(`/conversations/${conversationId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    },
    listConversations: async (skip = 0, limit = 20): Promise<ConversationResponse[]> => {
        try {
            const response = await apiServer.get<ConversationResponse[]>('/conversations', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing conversations:', error);
            throw error;
        }
    },
    updateConversation: async (conversationId: string, data: ConversationUpdate): Promise<ConversationResponse> => {
        try {
            const response = await apiServer.put<ConversationResponse>(`/conversations/${conversationId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating conversation:', error);
            throw error;
        }
    },
    deleteConversation: async (conversationId: string): Promise<void> => {
        try {
            await apiServer.delete(`/conversations/${conversationId}`);
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
            const response = await apiServer.post<ConversationResponse>(`/conversations/${conversationId}/add_character/${characterId}`);
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
            const response = await apiServer.post<ConversationResponse>(`/conversations/${conversationId}/remove_character/${characterId}`);
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
            const response = await apiServer.get<MessageResponse[]>(`/conversations/${conversationId}/messages`, { params: { skip, limit, order } });
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
            const response = await apiServer.post<CharacterResponse>('/characters', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating character:', error);
            throw error;
        }
    },
    getCharacter: async (characterId: string): Promise<CharacterResponse> => {
        try {
            const response = await apiServer.get<CharacterResponse>(`/characters/${characterId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching character:', error);
            throw error;
        }
    },
    listCharacters: async (skip = 0, limit = 20): Promise<CharacterResponse[]> => {
        try {
            const response = await apiServer.get<CharacterResponse[]>('/characters', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing characters:', error);
            throw error;
        }
    },
    updateCharacter: async (characterId: string, data: CharacterUpdate): Promise<CharacterResponse> => {
        try {
            const response = await apiServer.put<CharacterResponse>(`/characters/${characterId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating character:', error);
            throw error;
        }
    },
    deleteCharacter: async (characterId: string): Promise<void> => {
        try {
            await apiServer.delete(`/characters/${characterId}`);
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
            const response = await apiServer.get<CharacterResponse[]>('/characters/search', { params });
            return response.data;
        } catch (error: any) {
            console.error('Error searching characters:', error);
            throw error;
        }
    },
};

const characterRoles = {
    createRole: async (data: CharacterRoleCreate): Promise<CharacterRoleResponse> => {
        try {
            const response = await apiServer.post<CharacterRoleResponse>('/character/roles', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating role:', error);
            throw error;
        }
    },
    getRole: async (roleId: string): Promise<CharacterRoleResponse> => {
        try {
            const response = await apiServer.get<CharacterRoleResponse>(`/character/roles/${roleId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching role:', error);
            throw error;
        }
    },
    listRoles: async (skip = 0, limit = 20): Promise<CharacterRoleResponse[]> => {
        try {
            const response = await apiServer.get<CharacterRoleResponse[]>('/character/roles', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing roles:', error);
            throw error;
        }
    },
    updateRole: async (roleId: string, data: CharacterRoleUpdate): Promise<CharacterRoleResponse> => {
        try {
            const response = await apiServer.put<CharacterRoleResponse>(`/character/roles/${roleId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating role:', error);
            throw error;
        }
    },
    deleteRole: async (roleId: string): Promise<void> => {
        try {
            await apiServer.delete(`/characters/roles/${roleId}`);
        } catch (error: any) {
            console.error('Error deleting role:', error);
            throw error;
        }
    },
};

const characterTags = {
    createTag: async (data: CharacterTagCreate): Promise<CharacterTagResponse> => {
        try {
            const response = await apiServer.post<CharacterTagResponse>('/character/tags', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating tag:', error);
            throw error;
        }
    },
    getTag: async (tagId: string): Promise<CharacterTagResponse> => {
        try {
            const response = await apiServer.get<CharacterTagResponse>(`/character/tags/${tagId}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching tag:', error);
            throw error;
        }
    },
    listTags: async (skip = 0, limit = 20): Promise<CharacterTagResponse[]> => {
        try {
            const response = await apiServer.get<CharacterTagResponse[]>('/character/tags', { params: { skip, limit } });
            return response.data;
        } catch (error: any) {
            console.error('Error listing tags:', error);
            throw error;
        }
    },
    updateTag: async (tagId: string, data: CharacterTagUpdate): Promise<CharacterTagResponse> => {
        try {
            const response = await apiServer.put<CharacterTagResponse>(`/character/tags/${tagId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating tag:', error);
            throw error;
        }
    },
    deleteTag: async (tagId: string): Promise<void> => {
        try {
            await apiServer.delete(`/characters/tags/${tagId}`);
        } catch (error: any) {
            console.error('Error deleting tag:', error);
            throw error;
        }
    },
};

const server_api = {
    users,
    agents,
    characters,
    characterRoles,
    characterTags,
    messages,
    conversations,
};

export default server_api;
