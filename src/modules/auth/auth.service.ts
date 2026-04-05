const bcrypt = require("bcrypt");

import prisma from "../../config/db";
import ApiError from "../../shared/utils/ApiError";
import { env } from "../../config/env";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "./auth.utils";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "ANALYST" | "VIEWER" | "APPROVER";
};

type LoginPayload = {
  email: string;
  password: string;
};

const registerUser = async (payload: RegisterPayload) => {
  const { name, email, password, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    env.BCRYPT_SALT_ROUNDS
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "VIEWER",
    },
  });

  return user;
};

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.status === "INACTIVE") {
    throw new ApiError(403, "User is inactive");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const refreshTokenService = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newAccessToken = createAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken: newAccessToken,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshTokenService,
  getMe,
};