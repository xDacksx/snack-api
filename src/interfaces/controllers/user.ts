import { ControllerResponse } from ".";

export interface changePasswordProps {
    email: string;
    password: string;
    newPassword: string;
}

export interface changeRoleProps {
    role: "client" | "delivery" | "admin";
    email: string;
}

export type changePasswordResponse = ControllerResponse<boolean>;
