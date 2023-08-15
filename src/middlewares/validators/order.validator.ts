import { Next, Req, Res } from "../../interfaces/middlewares.interface";
import {
    validationResult,
    Result,
    ValidationError,
    check,
} from "express-validator";
import { verifyToken } from "../auth.middleware";

export const successValidator = [
    verifyToken,
    check("secret")
        .exists()
        .withMessage("Couldn't find role name field")

        .notEmpty()
        .withMessage("Role name field can not be empty")

        .isString()
        .trim()
        .withMessage("Role name value must be a string value"),

    (req: Req, res: Res, next: Next): Res | void => {
        const result: Result<ValidationError> = validationResult(req);
        const errors = result.array({ onlyFirstError: true });

        if (errors.length < 1) return next();

        return res.send({
            message: "You must fill the form!",
            errors,
        });
    },
];
