import { Router } from "express";
import { AuditController } from "./audit.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", auth("ADMIN"), AuditController.getAllAuditLogs);

export default router;