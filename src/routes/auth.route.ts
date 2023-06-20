import { Router } from "express";
import { signUp } from "../middlewares/auth.middleware";
const router: Router = Router();

router.post("/sign-up", signUp);

export { router as AuthRoute };
