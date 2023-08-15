import { Router } from "express";
import {
    changePassword,
    changeRole,
    deliverersList,
} from "../middlewares/user.middleware";
import {
    changePasswordValidator,
    changeRoleValidator,
} from "../middlewares/validators/user.validator";
import {
    addProduct,
    buyCart,
    deleteProduct,
    getCart,
} from "../middlewares/cart.middleware";
import { verifyToken } from "../middlewares/auth.middleware";
import {
    addProductValidator,
    buyCartValidator,
} from "../middlewares/validators/cart.validator";
import {
    getAllOrders,
    getOrder,
    successBought,
} from "../middlewares/order.middleware";
import {
    getOneValidator,
    successValidator,
} from "../middlewares/validators/order.validator";
const router: Router = Router();

router.patch("/change-password", changePasswordValidator, changePassword);
router.patch("/change-role", changeRoleValidator, changeRole);
router.get("/deliverers-list", deliverersList);

router.get("/cart", verifyToken, getCart);
router.post("/cart", addProductValidator, addProduct);
router.delete("/cart", addProductValidator, deleteProduct);
router.post("/cart/buy", buyCartValidator, buyCart);

router.get("/orders", verifyToken, getAllOrders);
router.get("/orders/:id", getOneValidator, getOrder);
router.patch("/orders/success", successValidator, successBought);

export { router as UserRoute };
