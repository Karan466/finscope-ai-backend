import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { RecordService } from "./record.service";

const createRecord = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await RecordService.createRecord(req.body, user);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Record created successfully",
    data: result,
  });
});

const getAllRecords = catchAsync(async (req: Request, res: Response) => {
  const result = await RecordService.getAllRecords(req.user, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Records fetched successfully",
    data: result,
  });
});

export const RecordController = {
  createRecord,
  getAllRecords,
};