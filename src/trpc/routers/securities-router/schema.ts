import {
  OptionStatusEnum,
  OptionTypeEnum,
  VestingScheduleEnum,
} from "@/prisma/enums";
import { SecuritiesStatusEnum, ShareLegendsEnum } from "@prisma/client";
import { z } from "zod";

export const ZodAddShareMutationSchema = z.object({
  id: z.string().optional(),
  status: z.nativeEnum(SecuritiesStatusEnum, {
    errorMap: () => ({ message: "Invalid value for status type" }),
  }),
  certificateId: z.string().min(1, {
    message: "Certificate ID is required",
  }),
  quantity: z.coerce.number().min(0, {
    message: "Quantity is required",
  }),
  pricePerShare: z.coerce.number().optional(),
  capitalContribution: z.coerce.number().min(0, {
    message: "Capital contribution is required",
  }),
  ipContribution: z.coerce.number().optional(),
  debtCancelled: z.coerce.number().optional(),
  otherContributions: z.coerce.number().optional(),
  vestingSchedule: z.nativeEnum(VestingScheduleEnum, {
    errorMap: () => ({ message: "Invalid value for vesting schedule" }),
  }),
  companyLegends: z
    .nativeEnum(ShareLegendsEnum, {
      errorMap: () => ({ message: "Invalid value for compnay legends" }),
    })
    .array(),
  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "This is not valid date",
  }),
  rule144Date: z.coerce.date({
    invalid_type_error: "This is not a valid date",
  }),
  vestingStartDate: z.coerce.date({
    invalid_type_error: "This is not a valid date",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board approval date is required",
    invalid_type_error: "This is not valid date",
  }),
  documents: z.array(
    z.object({
      bucketId: z.string(),
      name: z.string(),
    }),
  ),
  stakeholderId: z.string().min(1, {
    message: "Stakeholder is required",
  }),
  shareClassId: z.string().min(1, {
    message: "Share Class is required",
  }),
});

export type TypeZodAddShareMutationSchema = z.infer<
  typeof ZodAddShareMutationSchema
>;

export const ZodAddOptionMutationSchema = z.object({
  id: z.string().optional(),
  grantId: z.string(),
  notes: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0, {
    message: "Quantity is required",
  }),
  exercisePrice: z.coerce.number().min(0, {
    message: "Exercise price is required",
  }),
  type: z.nativeEnum(OptionTypeEnum, {
    errorMap: () => ({ message: "Invalid value for option type" }),
  }),
  status: z.nativeEnum(OptionStatusEnum, {
    errorMap: () => ({ message: "Invalid value for option status" }),
  }),
  vestingSchedule: z.nativeEnum(VestingScheduleEnum, {
    errorMap: () => ({ message: "Invalid value for vestingSchedule" }),
  }),
  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "This is not a valid date",
  }),
  expirationDate: z.coerce.date({
    required_error: "Expiration date is required",
    invalid_type_error: "This is not a valid date",
  }),
  vestingStartDate: z.coerce.date({
    required_error: "Vesting Start date is required",
    invalid_type_error: "This is not a valid date",
  }),
  boardApprovalDate: z.coerce.date({
    required_error: "Board Approval date is required",
    invalid_type_error: "This is not a valid date",
  }),
  rule144Date: z.coerce.date({
    required_error: "Rule 144 date is required",
    invalid_type_error: "This is not a valid date",
  }),
  documents: z.array(
    z.object({
      bucketId: z.string(),
      name: z.string(),
    }),
  ),
  stakeholderId: z.string(),
  equityPlanId: z.string(),
});

export type TypeZodAddOptionMutationSchema = z.infer<
  typeof ZodAddOptionMutationSchema
>;

export const ZodDeleteOptionMutationSchema = z.object({
  optionId: z.string(),
});

export type TypeZodDeleteOptionMutationSchema = z.infer<
  typeof ZodDeleteOptionMutationSchema
>;
