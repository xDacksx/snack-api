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
