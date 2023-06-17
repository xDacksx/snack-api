import { Router } from "express";
import { Index } from "../middlewares/_index";
const router: Router = Router();

router.get("/", Index);

export { router as IndexRouter };
