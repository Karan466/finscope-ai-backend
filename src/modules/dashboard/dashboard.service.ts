import prisma from "../../config/db";

const getDashboardStats = async () => {
  const income = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: {
      type: "INCOME",
      status: "ACTIVE",
    },
  });

  const expense = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: {
      type: "EXPENSE",
      status: "ACTIVE",
    },
  });

  const pendingApprovals = await prisma.approval.count({
    where: {
      decision: "PENDING",
    },
  });

  const anomalyCount = await prisma.anomalyReport.count();

  return {
    totalIncome: income._sum.amount || 0,
    totalExpense: expense._sum.amount || 0,
    netBalance:
      (income._sum.amount || 0) - (expense._sum.amount || 0),
    pendingApprovals,
    anomalyCount,
  };
};

const getMonthlySummary = async () => {
  const records = await prisma.financialRecord.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
  });

  const summary: Record<string, any> = {};

  records.forEach((record) => {
    const month = new Date(record.date).toLocaleString("default", {
      month: "short",
    });

    if (!summary[month]) {
      summary[month] = { income: 0, expense: 0 };
    }

    if (record.type === "INCOME") {
      summary[month].income += record.amount;
    } else {
      summary[month].expense += record.amount;
    }
  });

  return summary;
};

export const DashboardService = {
  getDashboardStats,
  getMonthlySummary,
};