import { Router } from "express";
import { isAuth } from "./../../middlewares/auth.js";
import { reviewRoles } from "./review.endpoints.js";
import * as reviewController from "./review.controller.js";
import * as reviewValSchema from "./review.validationSchemas.js";
import { validationCoreFunction } from "../../middlewares/validation.js";

const router = Router();

router.post(
	"/",
	isAuth(reviewRoles.addReview),
	validationCoreFunction(reviewValSchema.addReviewSchema),
	reviewController.addReview
);

export default router;
