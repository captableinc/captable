import { db } from "./db";
export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: { email },
      include: { blocked: true },
    });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
};
