import { Next, Req, Res } from "../../interfaces/middlewares.interface";
import {
    check,
    validationResult,
    Result,
    ValidationError,
    FieldValidationError,
    param,
} from "express-validator";
import { verifyToken } from "../auth.middleware";

export const createProductValidator = [
    verifyToken,
    check("name")
        .exists()
        .withMessage("Couldn't find name field")

        .notEmpty()
        .withMessage("Name field can not be empty")

        .isString()
        .trim()
        .withMessage("Name value must be a string value")

        .isLength({ min: 2, max: 50 })
        .withMessage("Name field must be 4-50 characters"),
    check("description")
        .exists()
        .withMessage("Couldn't find description field")

        .notEmpty()
        .withMessage("Description field can not be empty")

        .isString()
        .trim()
        .withMessage("Description value must be a string value")

        .isLength({ min: 2, max: 175 })
        .withMessage("Description field must be 4-175 characters"),

    check("quantity")
        .exists()
        .withMessage("Couldn't find quantity field")

        .notEmpty()
        .withMessage("Quantity field can not be empty")

        .isInt({ min: 0, max: 999 })
        .withMessage("Quantity value must be a number value"),

    check("price")
        .exists()
        .withMessage("Couldn't find price field")

        .notEmpty()
        .withMessage("Price field can not be empty")

        .isFloat()
        .withMessage("Price value must be a double value"),

    check("available")
        .exists()
        .withMessage("Couldn't find available field")

        .isBoolean()
        .withMessage("Available value must be a boolean value"),
    (req: Req, res: Res, next: Next): Res | void => {
        const result: Result<ValidationError> = validationResult(req);
        const errors = result.array({ onlyFirstError: true });

        function FileError(msg: string, value?: any): FieldValidationError {
            return {
                msg,
                type: "field",
                location: "body",
                path: "image",
                value: value ?? req.files?.image,
            };
        }

        if (!req.files) errors.push(FileError("Couldn't find image field"));
        if (req.files) {
            if (!req.files.image) {
                errors.push(FileError("Wrong input field name"));
            } else {
                const file = req.files.image;

                if (!("name" in file)) {
                    errors.push(
                        FileError(
                            "Image value must be a single file",
                            "array of files"
                        )
                    );
                } else {
                    if (!file.mimetype.includes("image"))
                        errors.push(
                            FileError("Image value must be an image", file.name)
                        );
                }
            }
        }

        if (errors.length < 1) return next();

        return res.send({
            message: "You must fill the form!",
            errors,
        });
    },
];

export const editProductValidator = [
    verifyToken,
    check("name")
        .optional()

        .notEmpty()
        .withMessage("Name field can not be empty")

        .isString()
        .trim()
        .withMessage("Name value must be a string value")

        .isLength({ min: 2, max: 50 })
        .withMessage("Name field must be 4-50 characters"),
    check("description")
        .optional()

        .notEmpty()
        .withMessage("Description field can not be empty")

        .isString()
        .trim()
        .withMessage("Description value must be a string value")

        .isLength({ min: 2, max: 175 })
        .withMessage("Description field must be 4-175 characters"),

    check("quantity")
        .optional()

        .notEmpty()
        .withMessage("Quantity field can not be empty")

        .isInt({ min: 0, max: 999 })
        .withMessage("Quantity value must be a number value"),

    check("price")
        .optional()

        .notEmpty()
        .withMessage("Price field can not be empty")

        .isFloat()
        .withMessage("Price value must be a double value"),

    check("available")
        .optional()

        .isBoolean()
        .withMessage("Available value must be a boolean value"),
    (req: Req, res: Res, next: Next): Res | void => {
        const result: Result<ValidationError> = validationResult(req);
        const errors = result.array({ onlyFirstError: true });

        function FileError(msg: string, value?: any): FieldValidationError {
            return {
                msg,
                type: "field",
                location: "body",
                path: "image",
                value: value ?? req.files?.image,
            };
        }

        if (req.files) {
            if (!req.files.image) {
                errors.push(FileError("Wrong input field name"));
            } else {
                const file = req.files.image;

                if (!("name" in file)) {
                    errors.push(
                        FileError(
                            "Image value must be a single file",
                            "array of files"
                        )
                    );
                } else {
                    if (!file.mimetype.includes("image"))
                        errors.push(
                            FileError("Image value must be an image", file.name)
                        );
                }
            }
        }

        if (errors.length < 1) return next();

        return res.send({
            message: "You must fill the form!",
            errors,
        });
    },
];

export const getProductValidator = [
    param("id")
        .exists()
        .withMessage("Couldn't find id param")

        .notEmpty()
        .withMessage("Id param can not be empty")

        .isInt({ min: 0, max: 999 })
        .withMessage("Id value must be a number value"),

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
