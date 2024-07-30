import { MemberStatusEnum } from "@/prisma/enums";
import { Roles } from "@/prisma/enums";
import { z } from "@hono/zod-openapi";

const MemberStatusArr = Object.values(MemberStatusEnum) as [
  string,
  ...string[],
];
const RolesArr = Object.values(Roles) as [string, ...string[]];

export const TeamMemberSchema = z.object({
  id: z.string().cuid().nullish().openapi({
    description: "Team member ID",
    example: "cly13ipa40000i7ng42mv4x7b",
  }),

  title: z.string().nullish().openapi({
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

  role: z.enum(RolesArr).nullish().openapi({
    description: "Role assigned to the member",
    example: "ADMIN",
  }),

  workEmail: z.string().nullish().openapi({
    description: "Work Email of the team member",
    example: "ceo@westwood.com",
  }),

  lastAccessed: z.string().datetime().nullish().openapi({
    description: "Team member last accessed at",
    example: "2022-01-01T00:00:00Z",
  }),

  createdAt: z.string().datetime().nullish().openapi({
    description: "Team member created at",
    example: "2022-01-01T00:00:00Z",
  }),

  updatedAt: z.string().datetime().nullish().openapi({
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

  customRoleId: z.string().cuid().nullish().openapi({
    description: "Custom role ID of the team member",
    example: "cly13ipa40000i7ng42mv4x7b",
  }),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const CreateMemberSchema = TeamMemberSchema.pick({
  title: true,
  role: true,
  customRoleId: true,
}).extend({
  email: z.string().openapi({
    description: "Work Email of the team member",
    example: "ceo@westwood.com",
  }),
});

export type TCreateMember = z.infer<typeof CreateMemberSchema>;

export const UpdateMemberSchema = TeamMemberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastAccessed: true,
})
  .partial()
  .refine(
    (data) => {
      return Object.values(data).some((val) => val !== undefined);
    },
    {
      message: "At least one field must be provided to update.",
    },
  )
  .openapi({
    description: "Update a Team Member by ID",
  });

export type UpdateMemberType = z.infer<typeof UpdateMemberSchema>;
