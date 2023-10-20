import { Router } from "express";
import * as productController from "./product.controller.js";
import { multerCloudFunction } from "./../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router();
router.get('/',productController.getAllProducts)
router.get('/getProductByTitle/',productController.getProductByTitle)
router.get('/listProducts/',productController.listProducts)

router.post(
	"/",
	multerCloudFunction(allowedExtensions.Image).array("images",3),
	productController.addProduct
);
router.put(
	"/",
	multerCloudFunction(allowedExtensions.Image).array("images",3),
	productController.updateProduct
);
export default router;
