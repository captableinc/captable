import { ACTIONS, SUBJECTS } from "@/constants/rbac";
import { z } from "zod";

export const ZodCreateRoleMutationSchema = z.object({
  name: z.string().min(1),
  permissions: z.record(
    z.enum(SUBJECTS),
    z.record(z.enum(ACTIONS), z.boolean()),
  ),
});

export type TypeZodCreateRoleMutationSchema = z.infer<
  typeof ZodCreateRoleMutationSchema
>;

export const ZodUpdateRoleMutationSchema = z.object({
  roleId: z.string().min(1),
  name: z.string().min(1),
  permissions: z.record(
    z.enum(SUBJECTS),
    z.record(z.enum(ACTIONS), z.boolean()),
  ),
});

export type TypeZodUpdateRoleMutationSchema = z.infer<
  typeof ZodUpdateRoleMutationSchema
>;

export const ZodDeleteRoleMutationSchema = z.object({
  roleId: z.string().min(1),
});

export type TypeZodDeleteRoleMutationSchema = z.infer<
  typeof ZodDeleteRoleMutationSchema
>;
