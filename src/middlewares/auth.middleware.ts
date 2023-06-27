import { controller } from "../controllers";
import { TypedResponse } from "../interfaces";
import { Req } from "../interfaces/middlewares.interface";
import { UserModel } from "../interfaces/models";
import { ServerResponse } from "../interfaces/server.interface";

type Res = TypedResponse<ServerResponse<null | UserModel>>;

export const signUp = async (req: Req, res: Res): Promise<Res> => {
    const { name, lastname, gender } = req.body;
    const { username, password } = req.body;

    const clientRole = await controller.role.client;
    const male = await controller.gender.male;
    const female = await controller.gender.female;

    const genderId = gender === "male" ? male?.id : female?.id;

    if (!genderId) return res.json();
    if (!clientRole?.id) return res.json();

    try {
        const user = await controller.auth.signUp({
            name,
            lastname,
            username,
            password,
            birthdate: new Date(),
            genderId,
            roleId: clientRole.id,
        });

        if (user) {
            return res.send({
                data: user,
                messsage: "User created succesfully",
                errors: [],
            });
        } else {
            return res.send({
                data: null,
                messsage: `User ${username} already exists!`,
                errors: [],
            });
        }
    } catch (error) {
        const errors: Array<string> = [];

        if (error instanceof Error) errors.push(error.message);

        return res.send({
            data: null,
            errors,
            messsage: "Error!",
        });
    }
};
