import prisma from "../../config/db";

const getDashboardStats = async (user: any, query: any) => {
  const { type, startDate, endDate, category } = query;

  let filter: any = {
    status: "ACTIVE",
  };

  // Role-based filter
  if (user.role !== "ADMIN") {
    filter.createdById = user.userId;
  }

  // Category filter
  if (category && category !== "ALL") {
    filter.category = category;
  }

  // Date filtering
  if (type === "monthly") {
    const now = new Date();
    filter.date = {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lte: new Date(),
    };
  }

  if (type === "yearly") {
    const now = new Date();
    filter.date = {
      gte: new Date(now.getFullYear(), 0, 1),
      lte: new Date(),
    };
  }

  if (startDate && endDate) {
    filter.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const records = await prisma.financialRecord.findMany({
    where: filter,
    select: {
      amount: true,
      type: true,
    },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  records.forEach((record) => {
    if (record.type === "INCOME") {
      totalIncome += record.amount;
    } else {
      totalExpense += record.amount;
    }
  });

  const pendingApprovals = await prisma.approval.count({
    where: {
      decision: "PENDING",
      ...(user.role !== "ADMIN" && {
        requestedById: user.userId,
      }),
    },
  });

  const anomalyCount = await prisma.anomalyReport.count({
    where:
      user.role !== "ADMIN"
        ? {
            record: {
              createdById: user.userId,
            },
          }
        : {},
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    pendingApprovals,
    anomalyCount,
  };
};

const getMonthlySummary = async (user: any, query: any) => {
  const { type, year, startDate, endDate, category } = query;

  let filter: any = {
    status: "ACTIVE",
  };

  if (user.role !== "ADMIN") {
    filter.createdById = user.userId;
  }

  // Category filter
  if (category && category !== "ALL") {
    filter.category = category;
  }

  // Year filter
  if (year) {
    const selectedYear = Number(year);
    filter.date = {
      gte: new Date(selectedYear, 0, 1),
      lte: new Date(selectedYear, 11, 31, 23, 59, 59),
    };
  }

  // Custom range
  if (startDate && endDate) {
    filter.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const records = await prisma.financialRecord.findMany({
    where: filter,
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const summary: Record<string, { income: number; expense: number }> = {};

  records.forEach((record) => {
    let label = "";

    if (type === "yearly") {
      label = new Date(record.date).getFullYear().toString();
    } else {
      label = new Date(record.date).toLocaleString("default", {
        month: "short",
      });
    }

    if (!summary[label]) {
      summary[label] = { income: 0, expense: 0 };
    }

    if (record.type === "INCOME") {
      summary[label].income += record.amount;
    } else {
      summary[label].expense += record.amount;
    }
  });

  return summary;
};

export const DashboardService = {
  getDashboardStats,
  getMonthlySummary,
};