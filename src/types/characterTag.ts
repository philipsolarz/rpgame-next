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
