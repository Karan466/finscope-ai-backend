import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", auth("ADMIN"), UserController.getAllUsers);

router.patch("/:id/role", auth("ADMIN"), UserController.updateRole);

router.patch("/:id/deactivate", auth("ADMIN"), UserController.deactivateUser);

router.patch("/:id/activate", auth("ADMIN"), UserController.activateUser);

export default router;