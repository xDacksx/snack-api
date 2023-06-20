import { Req, Res } from "../interfaces/middlewares.interface";

export const signUp = async (req: Req, res: Res): Promise<Res> => {
    return res.json("signUp");
};
