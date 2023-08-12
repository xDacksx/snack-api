import { compare, genSalt, hash } from "bcrypt";
import {
    changePasswordProps,
    changePasswordResponse,
    changeRoleProps,
} from "../interfaces/controllers/user";
import { ErrorMessage, InfoMessage } from "../utility";
import { controller, prisma } from ".";
import { RoleModel, UserModel } from "../interfaces/models";

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

    public async changeRole({
        email,
        role: roleName,
    }: changeRoleProps): Promise<changePasswordResponse> {
        try {
            const user = await controller.auth.findUser(email);
            if (!user) throw new Error("This user does not exist");

            let role: RoleModel | null = null;
            if (roleName === "delivery") role = await controller.role.delivery;
            if (roleName === "admin") role = await controller.role.admin;
            if (roleName === "client") role = await controller.role.client;

            if (!role) throw new Error("This role does not exist");
            await prisma.user.update({
                where: { email },
                data: {
                    roleId: role.id,
                },
            });

            InfoMessage("Account", email, `changed its role to ${role.name}`);

            return {
                data: true,
                message: "Role changed!",
            };
        } catch (error) {
            if (error instanceof Error) {
                ErrorMessage("Role change attempt", email);
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

    public async getAllUsers(): Promise<UserModel[]> {
        try {
            return await prisma.user.findMany();
        } catch (error) {
            return [];
        }
    }

    public async getAllDeliverers(): Promise<UserModel[]> {
        try {
            const delivery = await controller.role.delivery;
            if (!delivery) return [];

            return await prisma.user.findMany({
                where: { roleId: delivery.id },
            });
        } catch (error) {
            return [];
        }
    }
}
