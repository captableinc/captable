import { z } from "zod";

export const ZodInviteMemberMutationSchema = z.object({
  email: z.string().email().min(1),
  inviteeName: z.string(),
});

export type TypeZodInviteMemberMutationSchema = z.infer<
  typeof ZodInviteMemberMutationSchema
>;

export const ZodAcceptMemberMutationSchema = z.object({
  membershipId: z.string().min(1),
  name: z.string().min(1),
});

export type TypeZodAcceptMemberMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;
