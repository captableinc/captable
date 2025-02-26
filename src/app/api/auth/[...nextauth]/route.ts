import type { MemberStatusEnum } from "@/prisma/enums";
import NextAuth from "next-auth";
import type { User as NextAuthUser } from "next-auth";

import { authOptions } from "@/server/auth";

// Extend the NextAuth User type to include our custom properties
interface ExtendedUser extends NextAuthUser {
  companyId?: string;
  memberId?: string;
  isOnboarded?: boolean;
  companyPublicId?: string;
  status?: MemberStatusEnum | "";
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const authHandler = NextAuth({
  ...authOptions,
});

export { authHandler as GET, authHandler as POST };
