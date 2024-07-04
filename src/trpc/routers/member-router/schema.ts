import { PayloadType } from "@/lib/constants";
import { AvatarUploadInput, ProfileUpdateInput } from "@/lib/zodSchemas";
import { string, z } from "zod";

export const ZodInviteMemberMutationSchema = z.object({
  email: z.string().email().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  roleId: z.string().min(1),
});

export type TypeZodInviteMemberMutationSchema = z.infer<
  typeof ZodInviteMemberMutationSchema
>;

export const ZodInviteMemberArrayMutationSchema = z.array(
  ZodInviteMemberMutationSchema,
);

export type TypeZodInviteMemberArrayMutationSchema = z.infer<
  typeof ZodInviteMemberArrayMutationSchema
>;

export const ZodAcceptMemberMutationSchema = z.object({
  memberId: z.string().min(1),
  name: z.string().min(1, "This field is required"),
  token: z.string().min(1),
  workEmail: z.string().email().min(1, "This field is required"),
});

export type TypeZodAcceptMemberMutationSchema = z.infer<
  typeof ZodAcceptMemberMutationSchema
>;

export const ZodRevokeInviteMutationSchema = z.object({
  email: z.string().email().min(1),
  memberId: z.string().min(1),
});

export type TypeZodRevokeInviteMutationSchema = z.infer<
  typeof ZodRevokeInviteMutationSchema
>;

export const ZodRemoveMemberMutationSchema = z.object({
  memberId: z.string().min(1),
});

export type TypeZodRemoveMemberMutationSchema = z.infer<
  typeof ZodRemoveMemberMutationSchema
>;

export const ZodToggleActivationMutationSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
  memberId: z.string().min(1),
});

export type TypeZodToggleActivationMutationSchema = z.infer<
  typeof ZodToggleActivationMutationSchema
>;

export const ZodUpdateMemberMutationSchema = z
  .object({
    memberId: string(),
  })
  .merge(
    z
      .object({
        workEmail: z.string().email(),
        name: z.string(),
        title: z.string(),
        roleId: z.string(),
      })
      .partial(),
  );

export type TypeZodUpdateMemberMutationSchema = z.infer<
  typeof ZodUpdateMemberMutationSchema
>;

export const ZodReInviteMutationSchema = z.object({
  memberId: z.string().min(1),
});

export type TypeZodReInviteMutationSchema = z.infer<
  typeof ZodReInviteMutationSchema
>;

export const ZodUpdateProfileMutationSchema =
  AvatarUploadInput.or(ProfileUpdateInput);

export type TypeZodUpdateProfileMutationSchema = z.infer<
  typeof ZodUpdateProfileMutationSchema
>;
