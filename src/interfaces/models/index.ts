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
    name: string;
    lastname: string;
    birthdate: Date;

    genderId: number;
}

export interface User {
    username: string;
    password: string;
    personId: number;
    roleId: string;
}

export type GenderModel = Gender & Model;
export type RoleModel = Role & Model;
export type PersonModel = Person & Model;
export type UserModel = User & Model;
