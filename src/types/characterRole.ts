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
