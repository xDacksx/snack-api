import { Router } from "express";
import {
    verifyToken,
    signIn,
    signUp,
    sessionSignIn,
    getFirebaseApiKeys,
} from "../middlewares/auth.middleware";
import {
    signInVaidator,
    signUpVaidator,
} from "../middlewares/validators/auth.validator";
import { Index } from "../middlewares";
const router: Router = Router();

router.get("/firebase", getFirebaseApiKeys);
router.post("/sign-up", signUpVaidator, signUp);
router.post("/sign-in", signInVaidator, signIn);
router.get("/verify", verifyToken, sessionSignIn);

export { router as AuthRoute };
