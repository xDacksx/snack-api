import { Index } from "../middlewares";
import { Router } from "express";
const router: Router = Router();

router.get("/", Index);

export { router as IndexRouter };
