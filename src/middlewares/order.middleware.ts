import { controller } from "../controllers";
import { UserInformation } from "../interfaces/common/auth.interface";
import { Req, Res } from "../interfaces/middlewares.interface";

export const successBought = async (req: Req, res: Res): Promise<Res> => {
    const secret: string = req.query.secret as string;
    const id: string = req.query.id as string;

    const order = await controller.order.setState({ id, paid: true });

    if (order) return res.json(order);
    return res.json(null);
};

export const getAllOrders = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;

    const orders = await controller.order.getAll(email);

    return res.json(orders);
};

export const getOrder = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;

    const id = req.params.id as string;

    const orders = await controller.order.get(id);

    return res.json(orders);
};
