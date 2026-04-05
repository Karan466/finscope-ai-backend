import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { AnomalyService } from "./anomaly.service";

const getAllAnomalies = catchAsync(async (_req: Request, res: Response) => {
  const result = await AnomalyService.getAllAnomalies();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Anomalies fetched successfully",
    data: result,
  });
});

export const AnomalyController = {
  getAllAnomalies,
};