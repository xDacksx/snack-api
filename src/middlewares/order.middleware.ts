import { controller } from "../controllers";
import { UserInformation } from "../interfaces/common/auth.interface";
import { Req, Res } from "../interfaces/middlewares.interface";

export const successBought = async (req: Req, res: Res): Promise<Res> => {
    return res.json("successBought");
};

export const getAllOrders = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;

    const orders = await controller.order.getAll(email);

    return res.json(orders);
};
