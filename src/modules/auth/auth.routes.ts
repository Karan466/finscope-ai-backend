import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validate.middleware";
import auth from "../../middlewares/auth.middleware";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthController.login
);

router.post("/refresh-token", AuthController.refreshToken);

router.get("/me", auth(), AuthController.me);

router.post("/logout", AuthController.logout);

export default router;