import {
    Result,
    ValidationError,
    check,
    validationResult,
} from "express-validator";
import { Next, Req, Res } from "../../interfaces/middlewares.interface";
import { verifyAdmin } from "../auth.middleware";

export const changeInformationValidator = [
    verifyAdmin,
    check("whatsapp")
        .optional()

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isString()
        .trim()
        .isURL()
        .isURL()
        .withMessage("Id value must be a number value"),
    check("facebook")
        .optional()

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isString()
        .trim()
        .isURL()
        .withMessage("Id value must be a number value"),
    check("instagram")
        .optional()

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isString()
        .trim()
        .isURL()
        .withMessage("Id value must be a number value"),
    check("x")
        .optional()

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isString()
        .trim()
        .isURL()
        .withMessage("Id value must be a number value"),
    check("latX")
        .optional()

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isFloat()
        .withMessage("Id value must be a double value"),
    check("latY")
        .optional()

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isFloat()
        .withMessage("Id value must be a double value"),

    (req: Req, res: Res, next: Next): Res | void => {
        const result: Result<ValidationError> = validationResult(req);
        const errors = result.array({ onlyFirstError: true });
        const isFormEmpty = Object.keys(req.body).length < 1;

        if (errors.length < 1 && !isFormEmpty) return next();

        if (isFormEmpty)
            errors.push({
                type: "alternative",
                msg: "You need to send at least one value",
                nestedErrors: [],
            });

        return res.send({
            message: "You must fill the form!",
            errors,
        });
    },
];
