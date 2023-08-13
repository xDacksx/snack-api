import { controller } from "../controllers";
import { Req, Res } from "../interfaces/middlewares.interface";

export const Index = async (req: Req, res: Res): Promise<Res> => {
    return res.json("API");
};

export const EditInformation = async (req: Req, res: Res): Promise<Res> => {
    const info = await controller.information.getContactInfo();

    const instagram: string = req.body.instagram || info.instagram;
    const whatsapp: string = req.body.whatsapp || info.whatsapp;
    const facebook: string = req.body.facebook || info.facebook;
    const x: string = req.body.x || info.x;

    const latX: number = parseFloat(req.body.latX) || info.latX;
    const latY: number = parseFloat(req.body.latY) || info.latY;

    const data = await controller.information.editContactInfo({
        instagram,
        whatsapp,
        facebook,
        x,
        latX,
        latY,
    });

    return res.json(data);
};

export const GetInformation = async (req: Req, res: Res): Promise<Res> => {
    return res.json(await controller.information.getContactInfo());
};
