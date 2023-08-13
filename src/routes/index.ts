import { Index, EditInformation, GetInformation } from "../middlewares";
import { Router } from "express";
import { changeInformationValidator } from "../middlewares/validators/index.validator";
const router: Router = Router();

router.get("/", Index);
router.patch("/information", changeInformationValidator, EditInformation);
router.get("/information", GetInformation);

export { router as IndexRouter };
