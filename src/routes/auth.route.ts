import { verifyToken, signIn, signUp } from "../middlewares/auth.middleware";
import { signUpVaidator } from "../middlewares/validators/auth.validator";
import { signInVaidator } from "../middlewares/validators/auth.validator";
import { getFirebaseApiKeys } from "../middlewares/auth.middleware";
import { sessionSignIn } from "../middlewares/auth.middleware";
import { Router } from "express";

const router: Router = Router();

router.get("/firebase-keys", getFirebaseApiKeys);
router.post("/sign-up", signUpVaidator, signUp);
router.post("/sign-in", signInVaidator, signIn);
router.get("/verify", verifyToken, sessionSignIn);

export { router as AuthRoute };
