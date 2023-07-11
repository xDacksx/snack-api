export interface Model {
    createdAt: Date;
    updatedAt: Date | null;
}

export interface Role {
    id?: number;
    name: string;
}

export interface Gender {
    id?: number;
    name: string;
}

export interface User {
    email: string;
    password: string;

    name: string;
    lastname: string;
    birthdate: Date;

    roleId: number;
    genderId: number;
}

export interface Session {
    id?: string;
    userEmail: string;
    date: Date;
    expires: Date;
}

export type GenderModel = Gender & Model;
export type RoleModel = Role & Model;
export type UserModel = User & Model;
export type SessionModel = Session & Model;
