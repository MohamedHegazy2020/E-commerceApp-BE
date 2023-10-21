import Joi from "joi";
import { generalFields } from "./../../middlewares/validation.js";

export const addTocartSchema = {
	body: Joi.object({
		productId: generalFields._id.required(),
		quantity: Joi.number().required(),
	}).required(),
};


export const deleteFromCartSchema = {
	body: Joi.object({
		productId: generalFields._id.required(),
	}).required(),
};