import { Router } from "express";
import { ApprovalController } from "./approval.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

// Only APPROVER or ADMIN can manage approvals
router.get("/", auth("ADMIN", "APPROVER"), ApprovalController.getPendingApprovals);

router.patch("/:id/approve", auth("ADMIN", "APPROVER"), ApprovalController.approveRecord);

router.patch("/:id/reject", auth("ADMIN", "APPROVER"), ApprovalController.rejectRecord);

export default router;