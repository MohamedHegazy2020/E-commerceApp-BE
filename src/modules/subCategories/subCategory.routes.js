import { Router } from "express";
import * as subCategoryController from "./subCategory.controller.js";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import { createSubCategorySchema } from "./subCategory.validationSchemas.js";
const router = Router();

router.get(
	"/",

	subCategoryController.getAllSubCategories
);

router.post(
	"/",
	multerCloudFunction(allowedExtensions.Image).single("image"),
	validationCoreFunction(createSubCategorySchema),
	subCategoryController.createSubCategory
);

router.put(
	"/",
	multerCloudFunction(allowedExtensions.Image).single("image"),
	subCategoryController.updateSubCategory
);

router.delete("/", subCategoryController.deleteSubCategory);

export default router;
