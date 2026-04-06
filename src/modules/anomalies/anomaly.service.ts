import prisma from "../../config/db";
import { env } from "../../config/env";

const scanRecordForAnomaly = async (recordId: string) => {
  const record = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) return null;

  let reason = "";
  let severity = "";

  // Rule 1: Expense above approval threshold
  if (
    record.type === "EXPENSE" &&
    record.amount > env.APPROVAL_THRESHOLD
  ) {
    reason = "Expense exceeds approval threshold";
    severity = "HIGH";
  }

  // Rule 2: Very large transaction
  if (record.amount >= env.APPROVAL_THRESHOLD * 3) {
    reason = "Unusually high transaction detected";
    severity = "CRITICAL";
  }

  // Rule 3: Suspicious category
  if (
    ["Vendor Payment", "Equipment Purchase", "Cash Withdrawal"].includes(
      record.category
    ) &&
    record.amount > env.APPROVAL_THRESHOLD
  ) {
    reason = `Suspicious spending pattern in ${record.category}`;
    severity = "HIGH";
  }

  if (!reason) return null;

  const existing = await prisma.anomalyReport.findFirst({
    where: { recordId },
  });

  if (existing) return existing;

  const anomaly = await prisma.anomalyReport.create({
    data: {
      recordId: record.id,
      reason,
      severity,
    },
  });

  return anomaly;
};

const getAllAnomalies = async () => {
  return prisma.anomalyReport.findMany({
    include: {
      record: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const AnomalyService = {
  scanRecordForAnomaly,
  getAllAnomalies,
};