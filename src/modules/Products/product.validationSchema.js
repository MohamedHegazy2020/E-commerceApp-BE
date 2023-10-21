import Joi from "joi";
import { generalFields } from "./../../middlewares/validation.js";
// ======== add product Schema ==========================
export const addProductSchema = {
	body: Joi.object({
		title: Joi.string().required(),
		desc: Joi.string().required(),
		price: Joi.number().required(),
		appliedDiscount: Joi.number().optional(),
		colors: Joi.array().items(Joi.string()).optional(),
		sizes: Joi.array().items(Joi.string()).optional(),
		stock: Joi.number().min(1).default(1).required(),
	}).required(),
	query: Joi.object({
		brandId: generalFields._id.required(),
		subCategoryId: generalFields._id.required(),
	}).required(),
};

// ======== update product Schema ==========================
export const updateProductSchema = {
	body: Joi.object({
		title: Joi.string().optional(),
		desc: Joi.string().optional(),
		price: Joi.number().optional(),
		appliedDiscount: Joi.number().optional(),
		colors: Joi.array().items(Joi.string()).optional(),
		sizes: Joi.array().items(Joi.string()).optional(),
		stock: Joi.number().min(1).default(1).optional(),
	}).optional(),
	query: Joi.object({
		newBrandId: generalFields._id.optional(),
		newSubCategoryId: generalFields._id.optional(),
		productId: generalFields._id.required(),
	}).required(),
};
