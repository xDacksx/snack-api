export interface Model {
    createdAt: Date;
    updatedAt: Date | null;
}

export interface Gender {
    id?: number;
    name: string;
}

export interface Role {
    id?: string;
    name: string;
}

export interface Person {
    id?: number;
}

export interface User {
    username: string;
    password: string;

    name: string;
    lastname: string;
    birthdate: Date;

    roleId: string;
    genderId: number;
}

export type GenderModel = Gender & Model;
export type RoleModel = Role & Model;
export type UserModel = User & Model;
