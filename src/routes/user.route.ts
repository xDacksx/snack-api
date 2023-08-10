import { Router } from "express";
import { changePassword } from "../middlewares/user.middleware";
const router: Router = Router();

router.patch("/change-password", changePassword);

export { router as UserRoute };
