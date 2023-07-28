import { ServerResponse } from "../server.interface";
import { TypedResponse } from "..";
import { UserModel } from "../models";
import {
    UserInformation,
    googleSignIn,
    googleSignUp,
} from "../common/auth.interface";

export type ResSignUp = TypedResponse<ServerResponse<null | UserInformation>>;
export type ResSignIn = TypedResponse<
    ServerResponse<null | {
        user: UserInformation;
        token: string;
    }>
>;
export type ResVerifyToken = TypedResponse<ServerResponse<null>>;

type googleAuth = googleSignIn | googleSignUp;

export type ResGoogleAuth = TypedResponse<ServerResponse<googleAuth | null>>;

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
