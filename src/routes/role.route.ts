import { Router } from "express";
import { GetRole, GetRoles } from "../middlewares/role.middleware";
const router: Router = Router();

router.get("/", GetRoles);
router.get("/:id", GetRole);

export { router as RoleRoute };
