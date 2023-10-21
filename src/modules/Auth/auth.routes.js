import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as authValSchema from "./auth.validationSchemas.js";

const router = Router();

router.post(
	"/",
	validationCoreFunction(authValSchema.signUpSchema),
	authController.signUp
);
router.get(
	"/confirm/:token",
	validationCoreFunction(authValSchema.confirmEmailSchema),
	authController.confirmEmail
);
router.post(
	"/login",
	validationCoreFunction(authValSchema.logInSchema),
	authController.logIn
);
router.post(
	"/forget",
	validationCoreFunction(authValSchema.forgetPasswordSchema),
	authController.forgetPassword
);
router.post("/reset/:token",validationCoreFunction(authValSchema.resetPasswordSchema), authController.resetPassword);

export default router;
