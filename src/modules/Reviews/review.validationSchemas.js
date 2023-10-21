import Joi from "joi";
import { generalFields } from "./../../middlewares/validation.js";

export const addReviewSchema = {
	query: Joi.object({
		productId: generalFields._id.required(),
	}).required(),
	body: Joi.object({
		text: Joi.string().required(),
		rating: Joi.number().required(),
	}).required(),
};
