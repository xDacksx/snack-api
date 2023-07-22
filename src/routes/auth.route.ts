import { verifyToken, signIn, signUp } from "../middlewares/auth.middleware";
import {
    googleAuthVaidator,
    signUpVaidator,
} from "../middlewares/validators/auth.validator";
import { signInVaidator } from "../middlewares/validators/auth.validator";
import { getFirebaseApiKeys } from "../middlewares/auth.middleware";
import { sessionSignIn } from "../middlewares/auth.middleware";
import { googleAuth } from "../middlewares/auth.middleware";
import { Router } from "express";

const router: Router = Router();

router.get("/firebase-keys", getFirebaseApiKeys);

router.post("/google-auth", googleAuthVaidator, googleAuth);
router.post("/sign-up", signUpVaidator, signUp);
router.post("/sign-in", signInVaidator, signIn);
router.get("/verify", verifyToken, sessionSignIn);

export { router as AuthRoute };
