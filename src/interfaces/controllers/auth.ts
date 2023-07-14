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
