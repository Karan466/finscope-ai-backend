import { z } from "zod";

export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),

    role: z.enum(["ADMIN", "ANALYST", "VIEWER", "APPROVER"]).optional(),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
    }),
  }),
});