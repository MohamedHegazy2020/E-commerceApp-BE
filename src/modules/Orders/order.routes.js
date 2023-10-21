import { Router } from "express";
import * as orderController from "./order.controller.js";
import * as orderValSchema from "./order.validationSchemas.js";
import { isAuth } from "./../../middlewares/auth.js";
import { orderRoles } from "./order.endpoints.js";
import { validationCoreFunction } from "../../middlewares/validation.js";

const router = Router();

router.post(
	"/",
	isAuth(orderRoles.createOrder),
	validationCoreFunction(orderValSchema.addCoupnSchema),
	orderController.createOrder
);
router.post(
	"/fromCartToOrder",
	isAuth(orderRoles.fromCartToOrder),
	validationCoreFunction(orderValSchema.fromCartToOrder),
	orderController.fromCartToOrder
);

router.patch("/successOrder", orderController.successPayment);
router.patch("/cancelOrder", orderController.cancelPayment);

export default router;
