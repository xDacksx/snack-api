import { controller, primsa } from ".";
import { authSignUp } from "../interfaces/controllers/auth";
import { compare, genSalt, hash } from "bcrypt";
import { Person, UserModel } from "../interfaces/models";

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

    public async signUp(data: authSignUp) {
        try {
            const { name, lastname, birthdate, genderId } = data;
            const person = await controller.person.create({
                name,
                lastname,
                birthdate,
                genderId,
            });
            const clientRole = await controller.role.client;

            if (person && person.id && clientRole?.id) {
                const salt = await genSalt();
                const passwordHashed = await hash(data.password, salt);

                console.log(compare(data.password, passwordHashed));

                const user: UserModel = await primsa.user.create({
                    data: {
                        username: data.username,
                        password: passwordHashed,
                        personId: person.id,
                        roleId: clientRole.id,
                    },
                });

                return user;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}
