import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

// ====================== create subCategory Schema ===================

export const createSubCategorySchema = {
	body: Joi.object({
		name: Joi.string().min(4).max(10),
	})
		.required()
		.options({ presence: "required" }),
};

// ====================== update subCategory Schema ===================

export const updateSubCategorySchema = {
	body: Joi.object({
		name: Joi.string().optional(),
	}).optional(),
	query: Joi.object({
		subCategoryId: generalFields._id.optional(),
	}).optional(),
};

// ====================== delete subCategory Schema ===================

export const deleteSubCategorySchema = {
	query: Joi.object({
		subCategoryId: generalFields._id.required(),
	}).required(),
};
