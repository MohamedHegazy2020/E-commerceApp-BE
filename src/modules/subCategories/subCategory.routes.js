import { Router } from "express";
import * as subCategoryController from "./subCategory.controller.js";

import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as SubCategoryValSchema from "./subCategory.validationSchemas.js";
import { isAuth } from "../../middlewares/auth.js";
import { subCategoryRoles } from "./subCategory.endpoints.js";
const router = Router();

router.get(
	"/",

	subCategoryController.getAllSubCategories
);

router.post(
	"/",
	isAuth(subCategoryRoles.createSubCategory),
	multerCloudFunction(allowedExtensions.Image).single("image"),
	validationCoreFunction(SubCategoryValSchema.createSubCategorySchema),
	subCategoryController.createSubCategory
);

router.put(
	"/",
	isAuth(subCategoryRoles.updateSubCategory),
	multerCloudFunction(allowedExtensions.Image).single("image"),
	validationCoreFunction(SubCategoryValSchema.updateSubCategorySchema),
	subCategoryController.updateSubCategory
);

router.delete(
	"/",
	isAuth(subCategoryRoles.deleteSubCategory),
	validationCoreFunction(SubCategoryValSchema.deleteSubCategorySchema),
	subCategoryController.deleteSubCategory
);

export default router;
