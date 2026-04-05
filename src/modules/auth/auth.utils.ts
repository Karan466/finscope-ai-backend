const jwt = require("jsonwebtoken");
import { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { JwtPayloadType } from "../../shared/interfaces/jwtPayload.interface";

export const createAccessToken = (payload: JwtPayloadType) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const createRefreshToken = (payload: JwtPayloadType) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayloadType;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayloadType;
};