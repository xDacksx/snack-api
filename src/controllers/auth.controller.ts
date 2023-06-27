import { controller, primsa } from ".";
import { authSignUp } from "../interfaces/controllers/auth";
import { compare, genSalt, hash } from "bcrypt";
import { User, UserModel } from "../interfaces/models";
import { ErrorMessage } from "../utility";

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
        return null;
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
}
