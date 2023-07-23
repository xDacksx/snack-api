import { Router } from "express";
import { GetRole } from "../middlewares/role.middleware";
const router: Router = Router();

router.get("/:id", GetRole);

export { router as RoleRoute };
