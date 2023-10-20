import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { isAuth } from "./../../middlewares/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const router = Router();

router.post("/", isAuth([systemRoles.USER ,systemRoles.SUPER_ADMIN]), cartController.addToCart);
router.delete("/", isAuth([systemRoles.USER,systemRoles.SUPER_ADMIN]), cartController.deleteFromCart);

export default router;
