import { SessionModel, User, UserModel } from "../interfaces/models";
import { ControllerResponse } from "../interfaces/controllers";
import {
    authSignIn,
    controllerResGoogle,
    controllerResSession,
    controllerResSignIn,
} from "../interfaces/controllers/auth";
import { ErrorMessage, InfoMessage } from "../utility";
import { compare, genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { controller, prisma } from ".";

export class Auth {
    constructor() {}

    public async findUser(email: string): Promise<UserModel | null> {
        try {
            const data = await prisma.user.findUnique({ where: { email } });
            if (data) {
                const user: UserModel = data;
                return user;
            } else return null;
        } catch (error) {
            return null;
        }
    }

    public async signUp(data: User): Promise<UserModel | null> {
        try {
            const { name, lastname, genderId } = data;
            const clientRole = await controller.role.client;

            const alreadyExists = await controller.auth.findUser(data.email);
            if (alreadyExists) return null;

            if (clientRole && clientRole.id) {
                const salt = await genSalt();
                const passwordHashed = await hash(data.password, salt);

                const user: UserModel = await prisma.user.create({
                    data: {
                        email: data.email,
                        password: passwordHashed,

                        name,
                        lastname,

                        roleId: clientRole.id,
                        genderId: genderId,
                        birthdate: new Date(),
                    },
                });

                InfoMessage("Account", data.email, "created.");

                return user;
            }
            return null;
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }

    public async signIn(data: authSignIn): Promise<controllerResSignIn> {
        const { email, password } = data;
        const user = await this.findUser(email);

        if (user) {
            const passwordMatch = await compare(password, user.password);
            if (passwordMatch) {
                const session = await this.createSession(user.email);
                if (session) {
                    const webToken = sign(
                        session.id,
                        process.env.WEB_TOKEN || "secret"
                    );

                    InfoMessage("Account", data.email, "logged.");
                    console.log();

                    let role: "admin" | "client" | "delivery" = "client";

                    const admin = await controller.role.admin;
                    const delivery = await controller.role.delivery;

                    if (admin && admin.id === user.roleId) role = "admin";
                    if (delivery && delivery.id === user.roleId)
                        role = "delivery";

                    const gender = await controller.gender.searchId(
                        user.genderId
                    );

                    return {
                        data: {
                            user: {
                                email: user.email,
                                name: user.name,
                                lastname: user.lastname,
                                role,
                                //@ts-ignore
                                gender: gender.name,
                                createdAt: user.createdAt,
                                updatedAt: user.createdAt,
                            },
                            token: webToken,
                        },
                        message: `Logged as ${email}`,
                    };
                }

                return {
                    data: null,
                    message: "Unknown",
                };
            } else {
                return {
                    data: null,
                    message: "Wrong email/password combination!",
                };
            }
        } else {
            return {
                data: null,
                message: `Email: '${email}' is not registered!`,
            };
        }
    }

    private async createSession(email: string): Promise<SessionModel | null> {
        try {
            const date = new Date();
            const newDate = new Date(date.setMonth(date.getMonth() + 1));

            const existingSessions = await prisma.session.findMany({
                where: { userEmail: email },
            });

            if (existingSessions.length >= 10) {
                const oldest = existingSessions[0];
                await prisma.session.delete({ where: { id: oldest.id } });
                InfoMessage(
                    "Deleted oldest session of",
                    email,
                    `${oldest.date.toDateString()}`
                );
            }

            const session: SessionModel = await prisma.session.create({
                data: {
                    userEmail: email,
                    date,
                    expires: newDate,
                },
            });

            InfoMessage("Session created for", email, "account.");

            return session;
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }

    public async sessionSignIn(token: string): Promise<controllerResSession> {
        try {
            const sessionId = verify(token, process.env.WEB_TOKEN || "secret");

            const session = await prisma.session.findUnique({
                where: { id: sessionId.toString() },
            });

            if (!session)
                return {
                    data: null,
                    message: `No session was found with this id: ${sessionId}!`,
                };

            const user = await controller.auth.findUser(session.userEmail);

            if (!user)
                return {
                    data: null,
                    message: "This user was deleted or never existed!",
                };

            let role: "admin" | "client" | "delivery" = "client";

            const admin = await controller.role.admin;
            const delivery = await controller.role.delivery;

            if (admin && admin.id === user.roleId) role = "admin";
            if (delivery && delivery.id === user.roleId) role = "delivery";

            const gender = await controller.gender.searchId(user.genderId);

            return {
                data: {
                    email: user.email,
                    name: user.name,
                    lastname: user.lastname,
                    role,
                    //@ts-ignore
                    gender: gender.name,
                    createdAt: user.createdAt,
                    updatedAt: user.createdAt,
                },
                message: `Account ${user.email} logged`,
            };
        } catch (error) {
            if (error instanceof Error) {
                ErrorMessage(error.message);
                return {
                    data: null,
                    message: error.message,
                };
            }
            return {
                data: null,
                message: "Unknown error!",
            };
        }
    }

    public async google(data: User): Promise<controllerResGoogle> {
        try {
            const alreadyExists = await this.findUser(data.email);
            if (alreadyExists) {
                const res = await this.signIn({
                    email: data.email,
                    password: data.password,
                });

                if (!res.data) throw new Error("Parameter is not a number!");

                return {
                    data: {
                        mode: "sign-in",
                        data: {
                            user: res.data.user,
                            token: res.data?.token,
                        },
                    },
                    message: res.message,
                };
            }

            const res = await this.signUp(data);
            if (!res) throw new Error("Parameter is not a number!");

            let role: "admin" | "client" | "delivery" = "client";

            const admin = await controller.role.admin;
            const delivery = await controller.role.delivery;

            if (admin && admin.id === res.roleId) role = "admin";
            if (delivery && delivery.id === res.roleId) role = "delivery";

            const gender = await controller.gender.searchId(res.genderId);

            return {
                data: {
                    mode: "sign-up",
                    data: {
                        email: res.email,
                        name: res.name,
                        lastname: res.lastname,
                        role,
                        //@ts-ignore
                        gender: gender.name,
                        createdAt: res.createdAt,
                        updatedAt: res.updatedAt,
                    },
                },
                message: "Created account",
            };
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return {
                data: null,
                message: "Something went wrong!",
            };
        }
    }
}
