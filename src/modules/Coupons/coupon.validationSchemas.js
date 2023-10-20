import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const addCouponSchema = {
	body: Joi.object({
		couponCode: Joi.string().min(5).max(20).required(),
		isFixedAmount: Joi.boolean().optional(),
		isPercentage: Joi.boolean().optional(),
		couponAmount: Joi.number().positive().min(1).max(100).required(),
		fromDate: Joi.date()
			.greater(Date.now() - 24 * 60 * 60 * 1000)
			.required(),
		toDate: Joi.date().greater(Joi.ref("fromDate")).required(),
	}).required(),
};

export const deleteCoupnSchema = {
	query: Joi.object({
		couponId: generalFields._id.required(),
	}).required(),
};

export const assignUserSchema = {
	query: Joi.object({
		couponId: generalFields._id.required(),
	}),
	body: Joi.object({
		userId: generalFields._id.required(),
		maxUsage: Joi.number().min(1).required(),
	}).required(),
};
