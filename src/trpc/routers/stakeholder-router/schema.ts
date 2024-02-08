import { string, z } from "zod";

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
  name: z.string().min(1, "This field is required"),
  token: z.string().min(1),
  workEmail: z.string().email().min(1, "This field is required"),
});

export type TypeZodAcceptMemberMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;

export const ZodRevokeInviteMutationSchema = z.object({
  email: z.string().email().min(1),
  membershipId: z.string().min(1),
});

export type TypeZodRevokeInviteMutationSchema = z.infer<
  typeof ZodRevokeInviteMutationSchema
>;

export const ZodRemoveMemberMutationSchema = z.object({
  membershipId: z.string().min(1),
});

export type TypeZodRemoveMemberMutationSchema = z.infer<
  typeof ZodRemoveMemberMutationSchema
>;

export const ZodDeactivateUserMutationSchema = z.object({
  membershipId: z.string().min(1),
  status: z.boolean(),
});

export type TypeZodDeactivateUserMutationSchema = z.infer<
  typeof ZodDeactivateUserMutationSchema
>;

export const ZodUpdateMemberMutationSchema = z
  .object({
    membershipId: string(),
  })
  .merge(
    z
      .object({
        email: z.string().email(),
        name: z.string(),
        title: z.string(),
        access: z.enum(["admin", "stakeholder"]),
      })
      .partial(),
  );

export type TypeZodUpdateMemberMutationSchema = z.infer<
  typeof ZodUpdateMemberMutationSchema
>;

export const ZodReInviteMutationSchema = z.object({
  membershipId: z.string().min(1),
});

export type TypeZodReInviteMutationSchema = z.infer<
  typeof ZodReInviteMutationSchema
>;
