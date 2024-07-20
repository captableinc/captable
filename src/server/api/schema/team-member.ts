import { MemberStatusEnum } from "@/prisma/enums";
import { Roles } from "@/prisma/enums";
import { z } from "@hono/zod-openapi";

const MemberStatusArr = Object.values(MemberStatusEnum) as [
  string,
  ...string[],
];
const RolesArr = Object.values(Roles) as [string, ...string[]];

export const TeamMemberSchema = z.object({
  id: z.string().cuid().optional().openapi({
    description: "Team member ID",
    example: "cly13ipa40000i7ng42mv4x7b",
  }),

  title: z.string().nullable().openapi({
    description: "Team member title",
    example: "Co-Founder & CTO",
  }),

  status: z.enum(MemberStatusArr).openapi({
    description: "Team member Status",
    example: "ACTIVE",
  }),

  isOnboarded: z.boolean().openapi({
    description: "Is team member onboarded",
    example: false,
  }),

  role: z.enum(RolesArr).nullable().openapi({
    description: "Role assigned to the member",
    example: "ADMIN",
  }),

  workEmail: z.string().nullable().openapi({
    description: "Work Email of the team member",
    example: "ceo@westwood.com",
  }),

  lastAccessed: z.string().datetime().optional().openapi({
    description: "Team member last accessed at",
    example: "2022-01-01T00:00:00Z",
  }),

  createdAt: z.string().datetime().optional().openapi({
    description: "Team member created at",
    example: "2022-01-01T00:00:00Z",
  }),

  updatedAt: z.string().datetime().optional().openapi({
    description: "Team member updated at",
    example: "2022-01-01T00:00:00Z",
  }),

  userId: z.string().cuid().openapi({
    description: "User ID of the team member",
    example: "cly13ipa40000i7ng42mv4x7b",
  }),

  companyId: z.string().cuid().openapi({
    description: "Company ID",
    example: "cly13ipa40000i7ng42mv4x7b",
  }),

  customRoleId: z.string().cuid().nullable().openapi({
    description: "Custom role ID of the team member",
    example: "cly13ipa40000i7ng42mv4x7b",
  }),
});
