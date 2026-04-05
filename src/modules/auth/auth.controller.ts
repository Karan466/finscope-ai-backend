import { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync";
import sendResponse from "../../shared/utils/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  // set refresh token in cookies
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshTokenService(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed",
    data: result,
  });
});

const me = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthService.getMe(user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
  });
});

export const AuthController = {
  register,
  login,
  refreshToken,
  me,
  logout,
};