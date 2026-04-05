import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getDashboardStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats fetched",
    data: result,
  });
});

const getMonthlySummary = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getMonthlySummary();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Monthly summary fetched",
    data: result,
  });
});

export const DashboardController = {
  getStats,
  getMonthlySummary,
};