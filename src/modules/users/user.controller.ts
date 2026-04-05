import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.body;

  const result = await UserService.updateUserRole(
    req.params.id as string,
    role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deactivateUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deactivated successfully",
    data: result,
  });
});

const activateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.activateUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User activated successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  updateRole,
  deactivateUser,
  activateUser,
};