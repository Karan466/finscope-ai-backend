import { NextFunction, Request, Response } from "express";
import ApiError from "../shared/utils/ApiError";
import { verifyAccessToken } from "../modules/auth/auth.utils";

const auth = (...requiredRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new ApiError(401, "Authorization token missing"));
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return next(new ApiError(401, "Invalid authorization format"));
      }

      const decoded = verifyAccessToken(token);
      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return next(new ApiError(403, "You are not authorized"));
      }

      next();
    } catch (_error) {
      next(new ApiError(401, "Invalid or expired token"));
    }
  };
};

export default auth;