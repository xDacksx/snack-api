import { check, validationResult, Result } from "express-validator";
import { Next, Req, Res } from "../../interfaces/middlewares.interface";

export const signUpVaidator = [
    check("name")
        .exists()
        .withMessage("Couldn't find name field")

        .notEmpty()
        .withMessage("Name field can not be empty")

        .isString()
        .trim()
        .withMessage("Name value must be a string value")

        .isLength({ min: 4, max: 50 })
        .withMessage("Name field must be 4-50 characters"),
    check("lastname")
        .exists()
        .withMessage("Couldn't find lastname field")

        .notEmpty()
        .withMessage("Lastname field can not be empty")

        .isString()
        .trim()
        .withMessage("Lastname value must be a string value")

        .isLength({ min: 4, max: 50 })
        .withMessage("Lastname field must be 4-50 characters"),

    check("gender")
        .exists()
        .withMessage("Couldn't find gender field")

        .notEmpty()
        .withMessage("Gender field can not be empty")

        .isString()
        .trim()
        .withMessage("Gender value must be a string value")

        .isIn(["male", "female"])
        .withMessage("Gender value must be 'male' or 'female'"),

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
    (req: Req, res: Res, next: Next): Res | void => {
        const result: Result = validationResult(req);
        const errors = result.array({ onlyFirstError: true });

        if (errors.length < 1) return next();

        return res.send({
            message: "You must fill the form!",
            user: null,
            errors,
        });
    },
];
export const signInVaidator = [
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
    (req: Req, res: Res, next: Next): Res | void => {
        const result: Result = validationResult(req);
        const errors = result.array({ onlyFirstError: true });

        if (errors.length < 1) return next();

        return res.send({
            message: "You must fill the form!",
            user: null,
            errors,
        });
    },
];
