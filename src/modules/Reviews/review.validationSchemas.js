import Joi from "joi";
import { generalFields } from "./../../middlewares/validation.js";

export const addReviewSchema = {
	query: Joi.object({
		productId: generalFields._id.required(),
	}).required(),
	body: Joi.object({
		comment: Joi.string().min(5).max(255).optional(),
		rate: Joi.number().min(1).max(5).required(),
	}).required(),
};
  