export interface UserInformation {
    email: string;

    name: string;
    lastname: string;

    role: "admin" | "client" | "delivery";
    gender: string;
    google: boolean;

    createdAt: Date;
    updatedAt: Date | null;
}

export interface googleSignIn {
    mode: "sign-in";
    data: {
        user: UserInformation;
        token: string;
    };
}

export interface googleSignUp {
    mode: "sign-up";
    data: UserInformation;
}
