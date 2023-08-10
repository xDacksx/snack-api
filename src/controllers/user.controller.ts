import { compare, genSalt, hash } from "bcrypt";
import {
    changePasswordProps,
    changePasswordResponse,
} from "../interfaces/controllers/user";
import { ErrorMessage, InfoMessage } from "../utility";
import { controller, prisma } from ".";

export class User {
    constructor() {}

    public async changePassword({
        email,
        password,
        newPassword,
    }: changePasswordProps): Promise<changePasswordResponse> {
        try {
            const user = await controller.auth.findUser(email);
            if (!user) throw new Error("This user does not exist!");

            const passwordMatch = await compare(password, user.password);

            if (!passwordMatch) throw new Error("Wrong password!");

            const salt = await genSalt();
            const passwordHashed = await hash(newPassword, salt);

            await prisma.user.update({
                where: { email },
                data: { password: passwordHashed },
            });

            InfoMessage("Account", email, "changed its password");

            return {
                data: true,
                message: "Password changed!",
            };
        } catch (error) {
            if (error instanceof Error) {
                ErrorMessage("Password change attempt", email);
                return {
                    data: false,
                    message: error.message,
                };
            }
            return {
                data: false,
                message: "Error",
            };
        }
    }
}
