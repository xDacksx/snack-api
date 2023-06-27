import { controller, primsa } from ".";
import { authSignIn } from "../interfaces/controllers/auth";
import { compare, genSalt, hash } from "bcrypt";
import { User, UserModel } from "../interfaces/models";
import { ErrorMessage } from "../utility";
import { ControllerResponse } from "../interfaces/controllers";
import { sign } from "jsonwebtoken";

export class Auth {
    constructor() {}

    public async findUser(username: string): Promise<UserModel | null> {
        try {
            const data = await primsa.user.findUnique({ where: { username } });
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

            const alreadyExists = await controller.auth.findUser(data.username);
            if (alreadyExists) return null;

            if (clientRole && clientRole.id) {
                const salt = await genSalt();
                const passwordHashed = await hash(data.password, salt);

                const user: UserModel = await primsa.user.create({
                    data: {
                        username: data.username,
                        password: passwordHashed,

                        name,
                        lastname,

                        roleId: clientRole.id,
                        genderId: genderId,
                        birthdate: new Date(),
                    },
                });

                return user;
            }
            return null;
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }

    public async signIn(data: authSignIn): Promise<ControllerResponse<any>> {
        const { username, password } = data;
        const user = await this.findUser(username);

        if (user) {
            const passwordMatch = await compare(password, user.password);
            if (passwordMatch) {
                const webToken = sign(user, process.env.WEB_TOKEN || "secret", {
                    noTimestamp: true,
                });

                return {
                    data: {
                        user,
                        token: webToken,
                    },
                    message: `Logged as ${username}`,
                };
            } else {
                return {
                    data: null,
                    message: "Wrong username/password combination!",
                };
            }
        } else {
            return {
                data: null,
                message: `User '${username}' does not exist!`,
            };
        }
    }
}
