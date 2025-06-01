import type { MemberStatusEnum } from "@captable/db";

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    isOnboarded: boolean;
    companyId: string;
    memberId: string;
    companyPublicId: string;
    status: MemberStatusEnum | "";
  };
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    userId: string;
    activeOrganizationId?: string | null;
  };
}
