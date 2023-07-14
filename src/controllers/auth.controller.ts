import { SessionModel, User, UserModel } from "../interfaces/models";
import { ControllerResponse } from "../interfaces/controllers";
import { authSignIn } from "../interfaces/controllers/auth";
import { ErrorMessage, InfoMessage } from "../utility";
import { compare, genSalt, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { controller, primsa } from ".";

export class Auth {
    constructor() {}

    public async findUser(email: string): Promise<UserModel | null> {
        try {
            const data = await primsa.user.findUnique({ where: { email } });
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

                const user: UserModel = await primsa.user.create({
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

    public async signIn(data: authSignIn): Promise<
        ControllerResponse<{
            user: UserModel;
            token: string;
        } | null>
    > {
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

                    return {
                        data: {
                            user,
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

            const existingSessions = await primsa.session.findMany({
                where: { userEmail: email },
            });

            if (existingSessions.length >= 10) {
                const oldest = existingSessions[0];
                await primsa.session.delete({ where: { id: oldest.id } });
                InfoMessage(
                    "Deleted oldest session of",
                    email,
                    `${oldest.date.toDateString()}`
                );
            }

            const session: SessionModel = await primsa.session.create({
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

    public async sessionSignIn(
        token: string
    ): Promise<ControllerResponse<UserModel | null>> {
        try {
            const sessionId = verify(token, process.env.WEB_TOKEN || "secret");

            const session = await primsa.session.findUnique({
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

            return {
                data: user,
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
}
