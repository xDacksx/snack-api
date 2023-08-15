import { controller } from "../controllers";
import { UserInformation } from "../interfaces/common/auth.interface";
import { Req, Res } from "../interfaces/middlewares.interface";

export const getCart = async (req: Req, res: Res): Promise<Res> => {
    const UserInfo: UserInformation = res.locals.data;

    const { data: cart } = await controller.cart.get(UserInfo.email);

    return res.json(cart);
};

export const addProduct = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;
    const productId: number = parseInt(req.body.id);

    const data = await controller.cart.addProduct({ email, productId });

    return res.json(data);
};

export const deleteProduct = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;
    const productId: number = parseInt(req.body.id);

    const data = await controller.cart.deleteProduct({ email, productId });

    return res.json(data);
};

export const buyCart = async (req: Req, res: Res): Promise<Res> => {
    const { email }: UserInformation = res.locals.data;

    const location = req.body.location as string;

    const data = await controller.cart.buy(email, location);

    if (data && data.data) return res.json(data.data);

    return res.json(data);
};
