import { ControllerResponse } from ".";
import {
    UserInformation,
    googleSignIn,
    googleSignUp,
} from "../common/auth.interface";
import { UserModel } from "../models";

export interface authSignIn {
    email: string;
    password: string;
}

export type controllerResSignIn = ControllerResponse<{
    user: UserInformation;
    token: string;
} | null>;

export type controllerResSession = ControllerResponse<UserInformation | null>;

type googleAuth = googleSignIn | googleSignUp;

export type controllerResGoogle = ControllerResponse<googleAuth | null>;
