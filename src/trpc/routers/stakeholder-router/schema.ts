import { z } from "zod";

export type MemberInviteType = {
  email: string;
  name: string;
  title: string;
  access: "admin" | "stakeholder";
};

export const ZodInviteMemberMutationSchema = z.object({
  email: z.string().email().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  access: z.enum(["admin", "stakeholder"]),
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
  membershipId: z.string().min(1),
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

export const ZodDeactivateUserMutationSchema = z.object({
  membershipId: z.string().min(1),
  status: z.boolean(),
});

export type TypeZodDeactivateUserMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;
