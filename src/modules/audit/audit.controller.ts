import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { AuditService } from "./audit.service";

const getAllAuditLogs = catchAsync(async (_req: Request, res: Response) => {
  const result = await AuditService.getAllAuditLogs();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Audit logs fetched successfully",
    data: result,
  });
});

export const AuditController = {
  getAllAuditLogs,
};