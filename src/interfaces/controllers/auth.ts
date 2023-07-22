import { ControllerResponse } from ".";
import { UserModel } from "../models";

export interface authSignUp {
    name: string;
    lastname: string;
    birthdate: Date;

    email: string;
    password: string;

    genderId: number;
    roleId: number;
}

export interface authSignIn {
    email: string;
    password: string;
}

export type controllerResSignIn = ControllerResponse<{
    user: UserModel;
    token: string;
} | null>;

export type controllerResSession = ControllerResponse<UserModel | null>;

export type controllerResGoogle = ControllerResponse<{
    mode: "sign-in" | "sign-up";
    data:
        | UserModel
        | {
              user: UserModel;
              token: string;
          };
} | null>;
