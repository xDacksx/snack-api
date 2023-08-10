import { ControllerResponse } from ".";

export interface changePasswordProps {
    email: string;
    password: string;
    newPassword: string;
}

export type changePasswordResponse = ControllerResponse<boolean>;
