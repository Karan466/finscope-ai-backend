import prisma from "../../config/db";

const createAuditLog = async (
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValue?: any,
  newValue?: any
) => {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
    },
  });
};

const getAllAuditLogs = async () => {
  return prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const AuditService = {
  createAuditLog,
  getAllAuditLogs,
};