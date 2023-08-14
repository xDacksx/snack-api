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
    id: string;
    userEmail: string;
    date: Date;
    expires: Date;
}

export interface File {
    id: number;
    path: string;
    url: string;
}

export interface Directory {
    name: string;
    path: string;
    type: "file" | "folder";
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    imageId: number;
    quantity: number;
    available: boolean;
    price: number;
}
export interface ProductWithImg {
    id?: number;
    name: string;
    description: string;
    imageId: number;
    quantity: number;
    available: boolean;
    price: number;
    imageUrl: string;
}

export interface Information {
    id: number;
    name: string;
    value: string;
}

export interface Cart {
    id: number;
    userEmail: string;
}

export type GenderModel = Gender & Model;
export type RoleModel = Role & Model;
export type UserModel = User & Model;
export type SessionModel = Session & Model;
export type FileModel = File & Model;
export type ProductModel = Product & Model;
export type ProductWithImgModel = ProductWithImg & Model;
export type InformationModel = Information & Model;
export type CartModel = Cart & Model;
