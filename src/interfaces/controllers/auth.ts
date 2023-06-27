import { UserModel } from "../models";

export interface authSignUp {
    name: string;
    lastname: string;
    birthdate: Date;

    username: string;
    password: string;

    genderId: number;
    roleId: string;
}

export interface authSignIn {
    username: string;
    password: string;
}
