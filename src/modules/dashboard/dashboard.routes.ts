import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.get("/stats", auth(), DashboardController.getStats);
router.get("/monthly", auth(), DashboardController.getMonthlySummary);

export default router;