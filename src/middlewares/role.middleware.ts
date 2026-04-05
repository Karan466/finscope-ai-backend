import { NextFunction, Request, Response } from "express";
import ApiError from "../shared/utils/ApiError";

const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied"));
    }

    next();
  };
};

export default requireRole;