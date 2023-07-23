import { Router } from "express";
import { GetGender, GetGenders } from "../middlewares/gender.middleware";
const router: Router = Router();

router.get("/", GetGenders);
router.get("/:id", GetGender);

export { router as GenderRoute };
