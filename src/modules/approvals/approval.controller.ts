import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { ApprovalService } from "./approval.service";

const getPendingApprovals = catchAsync(async (_req: Request, res: Response) => {
  const result = await ApprovalService.getPendingApprovals();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending approvals fetched successfully",
    data: result,
  });
});

const approveRecord = catchAsync(async (req: Request, res: Response) => {
  const approvalId = req.params.id as string;
  const reviewerId = req.user!.userId;
  const { comment } = req.body;

  const result = await ApprovalService.approveRecord(
    approvalId,
    reviewerId,
    comment
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Approval successful",
    data: result,
  });
});

const rejectRecord = catchAsync(async (req: Request, res: Response) => {
  const approvalId = req.params.id as string;
  const reviewerId = req.user!.userId;
  const { comment } = req.body;

  const result = await ApprovalService.rejectRecord(
    approvalId,
    reviewerId,
    comment
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rejection successful",
    data: result,
  });
});

export const ApprovalController = {
  getPendingApprovals,
  approveRecord,
  rejectRecord,
};