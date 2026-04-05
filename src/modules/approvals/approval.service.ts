import prisma from "../../config/db";
import ApiError from "../../shared/utils/ApiError";

const getPendingApprovals = async () => {
  return prisma.approval.findMany({
    where: {
      decision: "PENDING",
    },
    include: {
      record: true,
      requestedBy: {
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

const approveRecord = async (
  approvalId: string,
  reviewerId: string,
  comment?: string
) => {
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { record: true },
  });

  if (!approval) {
    throw new ApiError(404, "Approval request not found");
  }

  if (approval.decision !== "PENDING") {
    throw new ApiError(400, "This request has already been processed");
  }

  await prisma.approval.update({
    where: { id: approvalId },
    data: {
      decision: "APPROVED",
      reviewedById: reviewerId,
      comment,
    },
  });

  await prisma.financialRecord.update({
    where: { id: approval.recordId },
    data: {
      status: "ACTIVE",
      approvedById: reviewerId,
    },
  });

  return {
    message: "Record approved successfully",
  };
};

const rejectRecord = async (
  approvalId: string,
  reviewerId: string,
  comment?: string
) => {
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { record: true },
  });

  if (!approval) {
    throw new ApiError(404, "Approval request not found");
  }

  if (approval.decision !== "PENDING") {
    throw new ApiError(400, "This request has already been processed");
  }

  await prisma.approval.update({
    where: { id: approvalId },
    data: {
      decision: "REJECTED",
      reviewedById: reviewerId,
      comment,
    },
  });

  await prisma.financialRecord.update({
    where: { id: approval.recordId },
    data: {
      status: "REJECTED",
    },
  });

  return {
    message: "Record rejected successfully",
  };
};

export const ApprovalService = {
  getPendingApprovals,
  approveRecord,
  rejectRecord,
};