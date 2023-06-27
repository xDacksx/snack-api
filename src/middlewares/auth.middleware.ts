import { controller } from "../controllers";
import { TypedResponse } from "../interfaces";
import { Req } from "../interfaces/middlewares.interface";
import { ServerResponse } from "../interfaces/server.interface";

type Test = TypedResponse<ServerResponse<null>>;

export const signUp = async (req: Req, res: Test): Promise<Test> => {
    const { name, lastname, gender } = req.body;
    const { username, password } = req.body;

    const clientRole = await controller.role.client;
    const male = await controller.gender.male;
    const female = await controller.gender.female;

    const genderId = gender === "male" ? male?.id : female?.id;

    if (!genderId) return res.json();
    if (!clientRole?.id) return res.json();

    const user = await controller.auth.signUp({
        name,
        lastname,
        username,
        password,
        birthdate: new Date(),
        genderId,
        roleId: clientRole.id,
    });

    return res.send({
        data: null,
        errors: [],
        messsage: "",
    });
};
