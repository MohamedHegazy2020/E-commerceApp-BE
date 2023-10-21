import Joi from "joi";
import { generalFields } from "../../middlewares/validation.js";

export const addBrandSchema = {
	body: Joi.object({
		name: Joi.string().trim().lowercase().required(),
	}).required(),
};
export const updateBrandSchema = {
	body: Joi.object({
		name: Joi.string().trim().lowercase().optional(),
	}).required(),
	query: Joi.object({
		brandId: generalFields._id.required(),
	}).required(),
};

export const deleteBrand = {

	query: Joi.object({
		brandId: generalFields._id.required(),
	}).required(),
};


export const getBrandsByCategoryIdSchema = {

	query: Joi.object({
		categoryId: generalFields._id.required(),
	}).required(),
};

export const getBrandsBySubCategoryIdSchema = {

	query: Joi.object({
		subCategoryId: generalFields._id.required(),
	}).required(),
};