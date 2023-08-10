import { Router } from "express";
import {
    createProductValidator,
    editProductValidator,
    getProductValidator,
} from "../middlewares/validators/product.validator";
import {
    createProduct,
    editProduct,
    getProduct,
    getProductImg,
    getProducts,
} from "../middlewares/product.middleware";
const router: Router = Router();

router.get("/", getProducts);
router.get("/:id", getProductValidator, getProduct);
router.get("/:id/img", getProductValidator, getProductImg);

router.post("/:id/edit", editProductValidator, editProduct);
router.post("/new", createProductValidator, createProduct);

export { router as ProductRoute };
