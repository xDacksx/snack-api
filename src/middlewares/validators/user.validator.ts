import { Next, Req, Res } from "../../interfaces/middlewares.interface";
import {
    validationResult,
    Result,
    ValidationError,
    param,
    check,
} from "express-validator";
import { verifyAdmin, verifyToken } from "../auth.middleware";

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

export const changeRoleValidator = [
    verifyToken,
    verifyAdmin,
    check("roleName")
        .exists()
        .withMessage("Couldn't find role name field")

        .notEmpty()
        .withMessage("Role name field can not be empty")

        .isString()
        .trim()
        .withMessage("Role name value must be a string value")

        .isIn(["admin", "client", "delivery"])
        .withMessage("Role name value must be 'admin', 'client' or 'delivery'"),
    check("email")
        .exists()
        .withMessage("Couldn't find username field")

        .notEmpty()
        .withMessage("Username field can not be empty")

        .isEmail()
        .trim()
        .withMessage("Email is invalid")

        .isLength({ min: 4, max: 50 })
        .withMessage("Username field must be 4-50 characters"),

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
