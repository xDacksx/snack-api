import { Router } from "express";
import { signUp } from "../middlewares/auth.middleware";
import { signUpVaidator } from "../middlewares/validators/auth.validator";
const router: Router = Router();

router.post("/sign-up", signUpVaidator, signUp);

export { router as AuthRoute };
