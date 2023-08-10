import { Next, Req, Res } from "../../interfaces/middlewares.interface";
import {
    validationResult,
    Result,
    ValidationError,
    param,
    check,
} from "express-validator";
import { verifyToken } from "../auth.middleware";

export const changePasswordValidator = [
    verifyToken,
    check("password")
        .exists()
        .withMessage("Couldn't find password field")

        .notEmpty()
        .withMessage("Password field can not be empty")

        .isString()
        .trim()
        .withMessage("Password value must be a string value")

        .isLength({ min: 4, max: 50 })
        .withMessage("Password field must be 4-50 characters"),
    check("newPassword")
        .exists()
        .withMessage("Couldn't find password field")

        .notEmpty()
        .withMessage("Password field can not be empty")

        .isString()
        .trim()
        .withMessage("Password value must be a string value")

        .isLength({ min: 4, max: 50 })
        .withMessage("Password field must be 4-50 characters"),

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
