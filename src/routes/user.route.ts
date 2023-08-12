import { Router } from "express";
import {
    changePassword,
    changeRole,
    deliverersList,
} from "../middlewares/user.middleware";
import {
    changePasswordValidator,
    changeRoleValidator,
} from "../middlewares/validators/user.validator";
const router: Router = Router();

router.patch("/change-password", changePasswordValidator, changePassword);
router.patch("/change-role", changeRoleValidator, changeRole);
router.get("/deliverers-list", deliverersList);

export { router as UserRoute };
