import { withServerSession } from "@/server/auth";
import { db } from "@/server/db";

export const POST = async (req: Request) => {
  const session = await withServerSession();
  const { user } = session;
};
