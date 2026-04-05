import prisma from "../../config/db";

const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserRole = async (userId: string, role: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  });

  return user;
};

const deactivateUser = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      status: "INACTIVE",
    },
  });

  return user;
};

const activateUser = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      status: "ACTIVE",
    },
  });

  return user;
};

export const UserService = {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
};