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
  token: z.string().min(1),
});

export type TypeZodAcceptMemberMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;

export const ZodRevokeInviteMutationSchema = z.object({
  email: z.string().email().min(1),
  companyId: z.string().min(1),
});

export type TypeZodRevokeInviteMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;

export const ZodRemoveMemberMutationSchema = z.object({
  membershipId: z.string().min(1),
});

export type TypeZodRemoveMemberMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;
