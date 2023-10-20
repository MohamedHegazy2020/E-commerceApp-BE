import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as validationSchema from "./coupon.validationSchemas.js";
import { isAuth } from "../../middlewares/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const router = Router();

router.post(
	"/",
	isAuth([systemRoles.ADMIN, systemRoles.SUPER_ADMIN]),

	validationCoreFunction(validationSchema.addCouponSchema),
	couponController.addCoupon
);
router.delete(
	"/",
	isAuth([systemRoles.ADMIN, systemRoles.SUPER_ADMIN]),

	validationCoreFunction(validationSchema.deleteCoupnSchema),
	couponController.deleteCoupon
);

router.patch(
	"/assignUserToCoupon",
	isAuth([systemRoles.ADMIN, systemRoles.SUPER_ADMIN]),

	validationCoreFunction(validationSchema.assignUserSchema),
	couponController.assignUserToCoupon
);

export default router;
