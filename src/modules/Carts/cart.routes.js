import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { isAuth } from "./../../middlewares/auth.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as cartValSchema from "./cart.validationSchemas.js";
import { cartRoles } from "./cart.endpoints.js";

const router = Router();

router.post(
	"/",
	isAuth(cartRoles.addTocart),
	validationCoreFunction(cartValSchema.addTocartSchema),
	cartController.addToCart
);
router.delete(
	"/",
	isAuth(cartRoles.deleteFromCart),
	validationCoreFunction(cartValSchema.deleteFromCartSchema),
	cartController.deleteFromCart
);
router.delete(
	"/clearCart",
	isAuth(cartRoles.clearCart),
	cartController.clearCart
);
export default router;
