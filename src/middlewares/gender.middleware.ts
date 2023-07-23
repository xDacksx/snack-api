import { controller } from "../controllers";
import { Req, Res } from "../interfaces/middlewares.interface";
import { ResGetGender } from "../interfaces/middlewares/gender";

export const GetGender = async (
    req: Req,
    res: ResGetGender
): Promise<ResGetGender> => {
    const id = req.params.id;

    const gender = await controller.gender.searchId(parseInt(id));

    if (!gender)
        return res.send({
            data: null,
            message: `This gender id does not belong to any gender!`,
            errors: ["Gender not found!"],
        });

    return res.send({
        data: gender,
        message: `Gender ${gender?.name} found!`,
        errors: [],
    });
};

export const GetGenders = async (req: Req, res: Res): Promise<Res> => {
    const genders = await controller.gender.all;

    return res.json(genders);
};
