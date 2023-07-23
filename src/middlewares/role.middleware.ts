import { controller } from "../controllers";
import { Req, Res } from "../interfaces/middlewares.interface";
import { ResGetRole } from "../interfaces/middlewares/role";

export const GetRole = async (
    req: Req,
    res: ResGetRole
): Promise<ResGetRole> => {
    const id = req.params.id;

    const role = await controller.role.searchId(parseInt(id));

    if (!role)
        return res.send({
            data: null,
            message: `This role id does not belong to any role!`,
            errors: ["Role not found!"],
        });

    return res.send({
        data: role,
        message: `Role ${role?.name} found!`,
        errors: [],
    });
};
