export const USER_ROLES = {
  ADMIN: "ADMIN",
  ANALYST: "ANALYST",
  VIEWER: "VIEWER",
  APPROVER: "APPROVER",
} as const;

export type TUserRole = keyof typeof USER_ROLES;