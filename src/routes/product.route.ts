import { Router } from "express";
import { createProductValidator } from "../middlewares/validators/product.validator";
import { createProduct, getProducts } from "../middlewares/product.middleware";
const router: Router = Router();

router.get("/", getProducts);
router.post("/new", createProductValidator, createProduct);

export { router as ProductRoute };
