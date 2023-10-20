import { Router } from "express";
import * as orderController from "./order.controller.js";
import { isAuth } from "./../../middlewares/auth.js";
import { orderRoles } from "./order.endpoints.js";

const router = Router();

router.post("/", isAuth(orderRoles.createOrder), orderController.createOrder);
router.post(
	"/fromCartToOrder",
	isAuth(orderRoles.fromCartToOrder),
	orderController.fromCartToOrder
);

router.get("/successOrder", orderController.successPayment);
router.get("/cancelOrder", orderController.cancelPayment);

export default router;
