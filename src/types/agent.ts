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
