import { Next, Req, Res } from "../../interfaces/middlewares.interface";
import {
    validationResult,
    Result,
    ValidationError,
    check,
} from "express-validator";
import { verifyToken } from "../auth.middleware";

export const addProductValidator = [
    verifyToken,
    check("id")
        .exists()
        .withMessage("Couldn't find role name field")

        .notEmpty()
        .withMessage("Role name field can not be empty")

        .isInt({ min: 1 })
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
export const buyCartValidator = [
    verifyToken,
    check("location")
        .exists()
        .withMessage("Couldn't find role name field")

        .notEmpty()
        .withMessage("Role name field can not be empty")

        .isString()
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
