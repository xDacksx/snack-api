import { Router } from "express";
import { createProductValidator } from "../middlewares/validators/product.validator";
import { createProduct } from "../middlewares/product.middleware";
const router: Router = Router();

router.post("/new", createProductValidator, createProduct);

export { router as ProductRoute };
