import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";
// ============================ add coupon schema ==================
export const addCoupnSchema = {
	body: Joi.object({
		productId: generalFields._id.required(),
		quantity: Joi.number().required(),
		address: Joi.array().items(Joi.string()).required(),
		phoneNumbers: Joi.string()
			.regex(/^01[0125][0-9]{8}$/)
			.required(),
		paymentMethod: Joi.string().valid("cash", "card"),
		couponCode: Joi.string().required(),
	}).required(),
};
// ============================ from cart to order =======================

export const fromCartToOrder = {
	body: Joi.object({
		address: Joi.array().items(Joi.string()).required(),
		phoneNumbers: Joi.string()
			.regex(/^01[0125][0-9]{8}$/)
			.required(),
		paymentMethod: Joi.string().valid("cash", "card"),
		couponCode: Joi.string().required(),
	}).required(),
	query: Joi.object({
		cartId: generalFields._id.required(),
	}).required(),
};
