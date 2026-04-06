import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import recordRoutes from "../modules/records/record.routes";
import approvalRoutes from "../modules/approvals/approval.routes";
import anomalyRoutes from "../modules/anomalies/anomaly.routes";
import auditRoutes from "../modules/audit/audit.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/records", recordRoutes);
router.use("/approvals", approvalRoutes);
router.use("/anomalies", anomalyRoutes);
router.use("/audit", auditRoutes);
router.use("/dashboard", dashboardRoutes);

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy ✅",
  });
});

export default router;