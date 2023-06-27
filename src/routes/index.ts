import { Router } from "express";
import { Index } from "../middlewares";
const router: Router = Router();

router.get("/", Index);

export { router as IndexRouter };
