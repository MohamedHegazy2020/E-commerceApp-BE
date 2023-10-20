import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

// ====================== create category Schema ===================

export const createCategorySchema = {
	body: Joi.object({
		name: Joi.string().min(4).max(15),
	})
		.required()
		.options({ presence: "required" }),
};

// ====================== update category Schema ===================

export const updateCategorySchema = {
	body: Joi.object({
		name: Joi.string().min(4).max(10),
	}).required(),
	query: Joi.object({
		categoryId: generalFields._id.required(),
	}).required(),
};

// ================= delete category schema ========================
export const deleteCategorySchema = {
	query: Joi.object({
		categoryId: generalFields._id.required(),
	}).required(),
};
