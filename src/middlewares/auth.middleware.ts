import {
    ResGoogleAuth,
    ResSignUp,
    ResVerifyToken,
} from "../interfaces/middlewares/auth";
import { ResGetFirebase, ResSignIn } from "../interfaces/middlewares/auth";
import { Next, Req, Res } from "../interfaces/middlewares.interface";
import { controller } from "../controllers";
import { UserInformation } from "../interfaces/common/auth.interface";

export const signUp = async (req: Req, res: ResSignUp): Promise<ResSignUp> => {
    const { name, lastname, gender } = req.body;
    const { email, password } = req.body;

    const clientRole = await controller.role.client;
    const male = await controller.gender.male;
    const female = await controller.gender.female;

    const genderId = gender === "male" ? male?.id : female?.id;

    if (!genderId) return res.json();
    if (!clientRole?.id) return res.json();

    try {
        const user = await controller.auth.signUp({
            name,
            lastname,
            email,
            password,
            birthdate: new Date(),
            genderId,
            roleId: clientRole.id,
            google: false,
        });

        if (user) {
            let role: "admin" | "client" | "delivery" = "client";

            const admin = await controller.role.admin;
            const delivery = await controller.role.delivery;

            if (admin && admin.id === user.roleId) role = "admin";
            if (delivery && delivery.id === user.roleId) role = "delivery";

            const gender = await controller.gender.searchId(user.genderId);

            return res.send({
                data: {
                    email: user.email,
                    name: user.name,
                    lastname: user.lastname,
                    google: user.google,
                    role,
                    //@ts-ignore
                    gender: gender.name,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                message: "Account created succesfully",
                errors: [],
            });
        } else {
            return res.send({
                data: null,
                message: `Email: ${email} is already in use!`,
                errors: [`Email: ${email} is already in use!`],
            });
        }
    } catch (error) {
        const errors: Array<string> = [];

        if (error instanceof Error) errors.push(error.message);

        return res.send({
            data: null,
            errors,
            message: "Error!",
        });
    }
};

export const signIn = async (req: Req, res: ResSignIn): Promise<ResSignIn> => {
    const { email, password } = req.body;

    try {
        const { data, message } = await controller.auth.signIn({
            email,
            password,
        });

        if (!data)
            return res.send({
                data,
                message,
                errors: [message],
            });

        const { token, user } = data;

        return res.send({
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                    lastname: user.lastname,
                    google: user.google,
                    role: user.role,
                    gender: user.gender,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                token,
            },
            message,
            errors: [],
        });
    } catch (error) {
        const errors: Array<string> = [];
        if (error instanceof Error) errors.push(error.message);
        return res.send({
            data: null,
            errors,
            message: "Error!",
        });
    }
};

export const sessionSignIn = async (
    _req: Req,
    res: ResSignIn
): Promise<ResSignIn> => {
    return res.send({
        data: res.locals.data,
        message: res.locals.msg,
        errors: [],
    });
};

export const verifyToken = async (
    req: Req,
    res: ResVerifyToken,
    next: Next
): Promise<ResVerifyToken | void> => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { data, message } = await controller.auth.sessionSignIn(
                token
            );

            res.locals.data = data;
            res.locals.msg = message;
            if (data) return next();
            return res.send({
                data,
                message,
                errors: [],
            });
        } catch (error) {
            const errors: Array<string> = [];
            if (error instanceof Error) errors.push(error.message);
            return res.send({
                data: null,
                errors,
                message: "Error!",
            });
        }
    } else {
        return res.send({
            data: null,
            errors: ["No token was found!"],
            message: "Error!",
        });
    }
};

export const verifyAdmin = async (
    req: Req,
    res: ResVerifyToken,
    next: Next
): Promise<ResVerifyToken | void> => {
    await verifyToken(req, res, () => {
        const user: UserInformation = res.locals.data;

        if (user.role === "admin") return next();

        return res.send({
            data: null,
            errors: ["This user is not an admin"],
            message: "This user is not an admin",
        });
    });
};

export const getFirebaseApiKeys = async (
    req: Req,
    res: ResGetFirebase
): Promise<ResGetFirebase> => {
    const firebaseConfig = {
        apiKey: process.env.apiKey as string,
        authDomain: process.env.authDomain as string,
        projectId: process.env.projectId as string,
        storageBucket: process.env.storageBucket as string,
        messagingSenderId: process.env.messagingSenderId as string,
        appId: process.env.appId as string,
    };

    if (!firebaseConfig.apiKey)
        return res.send({
            data: null,
            message: "No api key was found",
            errors: ["No api key was found"],
        });

    return res.send({
        data: firebaseConfig,
        errors: [],
        message: "",
    });
};

export const googleAuth = async (
    req: Req,
    res: ResGoogleAuth
): Promise<ResGoogleAuth> => {
    const { email, password, name, lastname } = req.body;

    const clientRole = await controller.role.client;
    const maleId = (await controller.gender.male)?.id;
    if (!maleId) return res.json();
    if (!clientRole?.id) return res.json();

    const data = await controller.auth.google({
        email,
        password,
        name,
        lastname,
        birthdate: new Date(),
        genderId: maleId,
        roleId: clientRole.id,
        google: true,
    });

    if (!data.data)
        return res.send({
            message: "Something went wrong",
            data: null,
            errors: [data.message],
        });

    if (data.data.mode === "sign-in") {
        return res.send({
            data: {
                mode: data.data.mode,
                data: data.data.data,
            },
            message: data.message,
            errors: [],
        });
    }

    return res.send({
        data: {
            mode: data.data.mode,
            data: data.data.data,
        },
        message: data.message,
        errors: [],
    });
};
