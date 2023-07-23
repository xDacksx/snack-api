import { Router } from "express";
import { GetGender } from "../middlewares/gender.middleware";
const router: Router = Router();

router.get("/:id", GetGender);

export { router as GenderRoute };
