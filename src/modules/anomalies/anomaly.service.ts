import prisma from "../../config/db";

const scanRecordForAnomaly = async (recordId: string) => {
  const record = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) return null;

  let isAnomalous = false;
  let reason = "";
  let severity = "LOW";

  if (record.amount > 100000) {
    isAnomalous = true;
    reason = "Transaction amount unusually high";
    severity = "HIGH";
  } else if (
    ["Unknown", "Misc", "Other"].includes(record.category) &&
    record.amount > 20000
  ) {
    isAnomalous = true;
    reason = "Suspicious category with high amount";
    severity = "MEDIUM";
  } else if (record.type === "EXPENSE" && record.amount > 75000) {
    isAnomalous = true;
    reason = "Large expense flagged for review";
    severity = "MEDIUM";
  }

  if (!isAnomalous) {
    return null;
  }

  const existing = await prisma.anomalyReport.findFirst({
    where: { recordId },
  });

  if (existing) return existing;

  return prisma.anomalyReport.create({
    data: {
      recordId,
      reason,
      severity,
    },
  });
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