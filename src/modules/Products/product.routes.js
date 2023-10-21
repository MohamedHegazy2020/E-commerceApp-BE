import { Router } from "express";
import * as productController from "./product.controller.js";
import * as productValSchema from "./product.controller.js";
import { multerCloudFunction } from "./../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import { isAuth } from './../../middlewares/auth.js';
import { productRoles } from "./product.endpoints.js";

const router = Router();
router.get("/", productController.getAllProducts);
router.get("/getProductByTitle/", productController.getProductByTitle);
router.get("/listProducts/", productController.listProducts);

router.post(
	"/",isAuth(productRoles.addProduct) , 
	multerCloudFunction(allowedExtensions.Image).array("images", 3),
	validationCoreFunction(productValSchema.addProduct),
	productController.addProduct
);
router.put(
	"/",isAuth(productRoles.updateProduct) ,
	multerCloudFunction(allowedExtensions.Image).array("images", 3),
	validationCoreFunction(productValSchema.updateProduct),

	productController.updateProduct
);
export default router;
