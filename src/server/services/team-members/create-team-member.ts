import { getRoleById } from "@/lib/rbac/access-control";
import { ADMIN_ROLE_ID } from "@/lib/rbac/constants";
import type { Roles } from "@/prisma/enums";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import { checkUserMembershipForInvitation } from "./check-user-membership";
import { createMember } from "./create-member";

interface CreateTeamMember {
  name: string;
  email: string;
  companyId: string;
  requestIp: string;
  userAgent: string;
  userId: string;
  role: Roles | null;
  title: string | null;
  customRoleId: string | null;
  companyName: string;
}

export const createTeamMember = async (payload: CreateTeamMember) => {
  const {
    title,
    companyId,
    customRoleId,
    email,
    name,
    requestIp,
    role,
    userAgent,
    userId,
    companyName,
  } = payload;

  const { verificationToken, member, success, message } = await db.$transaction(
    async (tx) => {
      const newUserOnTeam = await checkUserMembershipForInvitation(tx, {
        name,
        email,
        companyId,
      });

      if (!newUserOnTeam) {
        return {
          success: false,
          message: "user already a member",
        };
      }

      let userRole: Awaited<ReturnType<typeof getRoleById>> = {
        customRoleId: null,
        role: null,
      };

      if (role === "ADMIN") {
        userRole = await getRoleById({ id: ADMIN_ROLE_ID, tx });
      } else if (role === "CUSTOM") {
        if (!customRoleId) {
          return {
            success: false,
            message: "Enter the CustomRole ID when role set to CUSTOM",
          };
        }

        try {
          userRole = await getRoleById({ id: customRoleId, tx });
        } catch (error) {
          return {
            success: false,
            message: "Enter Valid CustomRole ID",
          };
        }
      }

      const { member, verificationToken } = await createMember(tx, {
        userId: newUserOnTeam.id,
        companyId,
        name,
        email,
        title: title || "",
        role: userRole,
      });

      await Audit.create(
        {
          action: "member.invited",
          companyId,
          actor: { type: "user", id: userId },
          context: {
            requestIp,
            userAgent,
          },
          target: [{ type: "user", id: member.userId }],
          summary: `${name} invited ${member.user?.name} to join ${companyName}`,
        },
        tx,
      );

      return {
        verificationToken,
        member,
        success: true,
        message: "Team member created Successfully 🎉 !",
      };
    },
  );

  if (!success) {
    return { success, message };
  }

  return {
    data: { verificationToken, member },
    success,
    message,
  };
};
