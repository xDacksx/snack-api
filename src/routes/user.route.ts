import { Router } from "express";
import { changePassword, changeRole } from "../middlewares/user.middleware";
import {
    changePasswordValidator,
    changeRoleValidator,
} from "../middlewares/validators/user.validator";
const router: Router = Router();

router.patch("/change-password", changePasswordValidator, changePassword);
router.patch("/change-role", changeRoleValidator, changeRole);

export { router as UserRoute };
