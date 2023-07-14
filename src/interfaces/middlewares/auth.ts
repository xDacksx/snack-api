import { TypedResponse } from "..";
import { UserModel } from "../models";
import { ServerResponse } from "../server.interface";

export type ResSignUp = TypedResponse<ServerResponse<null | UserInfo>>;
export type ResSignIn = TypedResponse<
    ServerResponse<null | {
        user: UserInfo;
        token: string;
    }>
>;
export type ResVerifyToken = TypedResponse<ServerResponse<null>>;

export type ResGetFirebase = TypedResponse<
    ServerResponse<firebaseConfig | null>
>;

interface firebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

interface UserInfo {
    email: string;

    name: string;
    lastname: string;

    roleId: number;
    genderId: number;

    createdAt: Date;
    updatedAt: Date | null;
}
