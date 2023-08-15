import { Req, Res } from "../interfaces/middlewares.interface";

export const successBought = async (req: Req, res: Res): Promise<Res> => {
    return res.json("successBought");
};
