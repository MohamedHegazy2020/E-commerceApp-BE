import { Router } from "express";
import { multerCloudFunction } from "./../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import * as brandController from "./brand.controller.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as brandValSchema from "./brand.validationSchemas.js";
import { isAuth } from "./../../middlewares/auth.js";
import { brandRoles } from "./brand.endpoints.js";
const router = Router();

router.post(
	"/",
	isAuth(brandRoles.addBrand),
	multerCloudFunction(allowedExtensions.Image).single("image"),
	validationCoreFunction(brandValSchema.addBrandSchema),
	brandController.addBrand
);

router.put(
	"/",
	isAuth(brandRoles.updateBrand),
	multerCloudFunction(allowedExtensions.Image).single("image"),
	validationCoreFunction(brandValSchema.updateBrandSchema),
	brandController.updateBrand
);
router.delete(
	"/",
	isAuth(brandRoles.deleteBrand),
	validationCoreFunction(brandValSchema.deleteBrand),
	brandController.deleteBrand
);
router.get(
	"/allBrandByCategoryId",
	validationCoreFunction(brandValSchema.getBrandsByCategoryIdSchema),
	brandController.getBrandsByCategoryId
);
router.get(
	"/allBrandBySubCategoryId",
	validationCoreFunction(brandValSchema.getBrandsBySubCategoryIdSchema),
	brandController.getBrandsBySubCategoryId
);
export default router;
