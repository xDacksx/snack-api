export interface Model {
    createdAt: Date;
    updatedAt: Date | null;
}

export interface Gender extends Model {
    id: number;
    name: string;
}

export interface Role extends Model {
    id: string;
    name: string;
}
