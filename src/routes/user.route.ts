import { Router } from "express";
import { changePassword } from "../middlewares/user.middleware";
import { changePasswordValidator } from "../middlewares/validators/user.validator";
const router: Router = Router();

router.patch("/change-password", changePasswordValidator, changePassword);

export { router as UserRoute };
