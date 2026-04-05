import { Router } from "express";
import { AnomalyController } from "./anomaly.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", auth("ADMIN", "ANALYST"), AnomalyController.getAllAnomalies);

export default router;