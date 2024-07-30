import { SendMemberInviteEmailJob } from "@/jobs/member-inivite-email";
import { generatePasswordResetToken } from "@/lib/token";
import type { Roles } from "@/prisma/enums";
import { withCompanyAuth } from "@/server/api/auth";
import { ApiError, ErrorResponses } from "@/server/api/error";
import type { PublicAPI } from "@/server/api/hono";
import {
  CreateMemberSchema,
  type TeamMember,
  TeamMemberSchema,
} from "@/server/api/schema/team-member";
import { getIp } from "@/server/api/utils";
import { createTeamMember } from "@/server/services/team-members/create-team-member";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";

const ParamsSchema = z.object({
  id: z
    .string()
    .cuid()
    .openapi({
      description: "Company ID",
      param: {
        name: "id",
        in: "path",
      },

      example: "clycjihpy0002c5fzcyf4gjjc",
    }),
});

const ResponseSchema = z.object({
  message: z.string(),
  data: TeamMemberSchema,
});

const route = createRoute({
  method: "post",
  path: "/v1/companies/{id}/teams",
  summary: "Create Team Members",
  description: "Create Team Members in a company.",
  tags: ["Member"],
  request: {
    params: ParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateMemberSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
      description: "Create Team Members",
    },
    ...ErrorResponses,
  },
});

const create = (app: PublicAPI) => {
  app.openapi(route, async (c: Context) => {
    const { company, user } = await withCompanyAuth(c);
    const body = await c.req.json();

    const email: string = body.email;
    const title: string | null = body.title;
    const role: Roles | null = body.role;
    const customRoleId: string | null = body.customRoleId;

    const requestIp = getIp(c.req);
    const userAgent = c.req.header("User-Agent") || "";

    const { data, success, message } = await createTeamMember({
      companyId: company.id,
      companyName: company.name,
      email,
      customRoleId,
      name: user.name || "",
      requestIp,
      userAgent,
      userId: user.id,
      role,
      title,
    });

    if (!success && !data) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message,
      });
    }

    const verificationToken = data.verificationToken as string;
    const member = data.member;

    const currentTime = new Date().toISOString();

    const responseData: TeamMember = {
      companyId: member?.companyId || "",
      customRoleId: member?.customRoleId || null,
      isOnboarded: member?.isOnboarded || true,
      role: member?.role || null,
      status: member?.status || "",
      title: member?.title || "",
      userId: member?.userId || "",
      workEmail: member?.workEmail || "",
      id: member?.id || "",
      createdAt: member?.createdAt.toString() || currentTime,
      lastAccessed: member?.lastAccessed.toString() || currentTime,
      updatedAt: member?.updatedAt.toString() || currentTime,
    };

    const { token: passwordResetToken } =
      await generatePasswordResetToken(email);

    const payload = {
      verificationToken,
      passwordResetToken,
      email,
      company,
      user: {
        email: user.email,
        name: user.name,
      },
    };

    await new SendMemberInviteEmailJob().emit(payload);

    return c.json({ message, data: responseData });
  });
};

export default create;
