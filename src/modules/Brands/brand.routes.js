import { Router } from "express";
import { multerCloudFunction } from "./../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import * as brandController from "./brand.controller.js";
const router = Router();

router.post(
	"/",
	multerCloudFunction(allowedExtensions.Image).single("image"),
	brandController.addBrand
);

export default router;
