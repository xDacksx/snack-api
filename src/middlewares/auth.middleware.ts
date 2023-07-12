import { controller } from "../controllers";
import { Next, Req } from "../interfaces/middlewares.interface";
import {
    ResSignIn,
    ResSignUp,
    ResVerifyToken,
} from "../interfaces/middlewares/auth";

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
        });

        if (user) {
            return res.send({
                data: {
                    email: user.email,
                    name: user.name,
                    lastname: user.lastname,
                    roleId: user.roleId,
                    genderId: user.genderId,
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
                    roleId: user.roleId,
                    genderId: user.genderId,
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
