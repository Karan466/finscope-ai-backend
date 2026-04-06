import { AnomalyService } from "../anomalies/anomaly.service";
import prisma from "../../config/db";
import ApiError from "../../shared/utils/ApiError";
import { env } from "../../config/env";

type CreateRecordPayload = {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  note?: string;
};

const createRecord = async (payload: CreateRecordPayload, user: any) => {
  const { amount, type, category, date, note } = payload;

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }

  const isLargeTransaction = amount > env.APPROVAL_THRESHOLD;

  const record = await prisma.financialRecord.create({
    data: {
      amount,
      type,
      category,
      date: new Date(date),
      note,
      status: isLargeTransaction ? "PENDING_APPROVAL" : "ACTIVE",
      createdById: user.userId,
    },
  });

  // ✅ Create approval if threshold crossed
  if (isLargeTransaction) {
    await prisma.approval.create({
      data: {
        recordId: record.id,
        requestedById: user.userId,
        decision: "PENDING",
      },
    });
  }

  // ✅ Scan anomaly
  await AnomalyService.scanRecordForAnomaly(record.id);

  return record;
};

const getAllRecords = async (user: any, query: any) => {
  const { category } = query;

  let filter: any = {};

  if (user.role !== "ADMIN") {
    filter.createdById = user.userId;
  }

  if (category && category !== "ALL") {
    filter.category = category;
  }

  return prisma.financialRecord.findMany({
    where: filter,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      approval: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const RecordService = {
  createRecord,
  getAllRecords,
};