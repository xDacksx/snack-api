import { Req, Res } from "../interfaces/middlewares.interface";

export const Index = async (req: Req, res: Res): Promise<Res> => {
    return res.json("API");
};
