import { Router } from "express";
import {
    verifyToken,
    signIn,
    signUp,
    sessionSignIn,
    getFirebaseApiKeys,
    googleSignUp,
} from "../middlewares/auth.middleware";
import {
    signInVaidator,
    signUpVaidator,
} from "../middlewares/validators/auth.validator";
const router: Router = Router();

router.get("/firebase-keys", getFirebaseApiKeys);
router.post("/sign-up", signUpVaidator, signUp);
router.post("/sign-in", signInVaidator, signIn);
router.get("/verify", verifyToken, sessionSignIn);

export { router as AuthRoute };
