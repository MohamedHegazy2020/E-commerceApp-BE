import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router(); 

router.post("/", authController.signUp);
router.get("/confirm/:token", authController.confirmEmail);
router.post("/login", authController.logIn);
router.post("/forget", authController.forgetPassword);
router.post("/reset/:token", authController.resetPassword);

export default router;
