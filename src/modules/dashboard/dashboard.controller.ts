import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getDashboardStats(
    req.user,
    req.query
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats fetched",
    data: result,
  });
});

const getMonthlySummary = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getMonthlySummary(
    req.user,
    req.query
  );

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