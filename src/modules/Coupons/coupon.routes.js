import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as validationSchema from "./coupon.validationSchemas.js";
import { isAuth } from "../../middlewares/auth.js";
import { couponRoles } from "./coupon.endpoints.js";

const router = Router();

router.post(
	"/",
	isAuth(couponRoles.addCoupon),

	validationCoreFunction(validationSchema.addCouponSchema),
	couponController.addCoupon
);
router.delete(
	"/",
	isAuth(couponRoles.deleteCoupon),

	validationCoreFunction(validationSchema.deleteCoupnSchema),
	couponController.deleteCoupon
);

router.patch(
	"/assignUserToCoupon",
	isAuth(couponRoles.assignUserToCoupon),

	validationCoreFunction(validationSchema.assignUserSchema),
	couponController.assignUserToCoupon
);

export default router;
