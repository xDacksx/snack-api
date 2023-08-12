import { controller } from "../controllers";
import { UserInformation } from "../interfaces/common/auth.interface";
import { Req, Res } from "../interfaces/middlewares.interface";

export const changePassword = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;

    const password: string = req.body.password;
    const newPassword: string = req.body.newPassword;

    const data = await controller.user.changePassword({
        email,
        password,
        newPassword,
    });

    return res.json(data);
};

export const changeRole = async (req: Req, res: Res): Promise<Res> => {
    const role: "client" | "admin" | "delivery" = req.body.roleName;
    const email: string = req.body.email;

    const data = await controller.user.changeRole({ email, role });

    return res.json(data);
};

export const deliverersList = async (req: Req, res: Res): Promise<Res> => {
    const users = await controller.user.getAllDeliverers();
    const deliverers: UserInformation[] = [];

    for (let i = 0; i < users.length; i++) {
        const {
            email,
            name,
            lastname,
            createdAt,
            updatedAt,
            roleId,
            genderId,
        } = users[i];

        let role: "admin" | "client" | "delivery" = "client";

        const admin = await controller.role.admin;
        const delivery = await controller.role.delivery;

        if (admin && admin.id === roleId) role = "admin";
        if (delivery && delivery.id === roleId) role = "delivery";

        const gender = await controller.gender.searchId(genderId);

        deliverers.push({
            email,
            name,
            lastname,
            //@ts-ignore
            gender: gender.name,
            role,
            createdAt,
            updatedAt,
        });
    }

    return res.json(deliverers);
};
