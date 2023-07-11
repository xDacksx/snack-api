import { controller } from "../controllers";
import { TypedResponse } from "../interfaces";
import { Req } from "../interfaces/middlewares.interface";
import { UserModel } from "../interfaces/models";
import { ServerResponse } from "../interfaces/server.interface";

type ResSignUp = TypedResponse<ServerResponse<null | UserModel>>;

export const signUp = async (req: Req, res: ResSignUp): Promise<ResSignUp> => {
    const { name, lastname, gender } = req.body;
    const { email, password } = req.body;

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
            email,
            password,
            birthdate: new Date(),
            genderId,
            roleId: clientRole.id,
        });

        if (user) {
            return res.send({
                data: user,
                messsage: "Account created succesfully",
                errors: [],
            });
        } else {
            return res.send({
                data: null,
                messsage: `Email: ${email} is already in use!`,
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

export const signIn = async (req: Req, res: ResSignUp): Promise<ResSignUp> => {
    const { email, password } = req.body;

    const data = await controller.auth.signIn({ email, password });

    return res.json(data);
};
