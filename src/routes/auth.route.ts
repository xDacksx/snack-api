import { Router } from "express";
import { signIn, signUp } from "../middlewares/auth.middleware";
import {
    signInVaidator,
    signUpVaidator,
} from "../middlewares/validators/auth.validator";
const router: Router = Router();

router.post("/sign-up", signUpVaidator, signUp);
router.post("/sign-in", signInVaidator, signIn);

export { router as AuthRoute };
