import { z } from "zod";

export const AuditSchema = z.object({
  companyId: z.string(),
  action: z.enum([
    "user.signed-up",
    "user.onboarded",
    "user.verified",
    "user.password-updated",

    "company.created",
    "company.updated",

    "member.invited",
    "member.re-invited",
    "member.accepted",
    "member.updated",
    "member.removed",
    "member.revoked-invite",
    "member.deactivated",
    "member.activated",

    "stakeholder.added",
    "stakeholder.updated",
    "stakeholder.deleted",

    "shareClass.created",
    "shareClass.updated",
    "shareClass.deleted",

    "equityPlan.created",
    "equityPlan.updated",
    "equityPlan.deleted",

    "document.created",
    "document.deleted",

    "option.created",
    "option.deleted",

    "share.created",
    "share.updated",
    "share.deleted",

    "safe.created",
    "safe.imported",
    "safe.sent",
    "safe.signed",
    "safe.deleted",

    "documentShare.created",

    "password.updated",

    "update.created",
    "update.updated",
    "update.cloned",
    "update.shared",
    "update.unshared",

    "apiKey.created",
    "apiKey.deleted",

    "bucket.created",

    "dataroom.created",
    "dataroom.updated",
    "dataroom.shared",
    "dataroom.deleted",

    "role.created",
    "role.updated",
    "role.deleted",

    "template.updated",
    "template.created",

    "passkey.created",
    "passkey.deleted",
    "passkey.updated",

    "2fa.enabled",
    "2fa.disabled",
    
    "userAccount.blocked",
  ]),
  occurredAt: z.date().optional(),
  actor: z.object({
    type: z.enum(["user", "company", "document", "option"]),
    id: z.string().optional().nullable(),
  }),

  target: z.array(
    z.object({
      type: z.enum([
        "user",
        "company",
        "document",
        "option",
        "documentShare",
        "share",
        "update",
        "stakeholder",
        "apiKey",
        "bucket",
        "stripeSession",
        "stripeBillingPortalSession",
        "dataroom",
        "role",
        "template",
        "passkey",
        "2fa",
      ]),
      id: z.string().optional().nullable(),
    }),
  ),

  context: z.object({
    requestIp: z.string(),
    userAgent: z.string(),
  }),

  summary: z.string().optional(),
});

export type AuditSchemaType = z.infer<typeof AuditSchema>;

export const getActions = () => {
  const actions = AuditSchema.shape.action.Values;
  return Object.values(actions).map((action) => ({
    label: action,
    value: action,
  }));
};

export const EsignAuditSchema = z.object({
  action: z.enum([
    "document.complete",
    "recipient.signed",
    "document.email.sent",
  ]),
  occurredAt: z.date().optional(),
  templateId: z.string(),
  recipientId: z.string().optional(),
  companyId: z.string(),
  ip: z.string(),
  userAgent: z.string(),
  location: z.string(),
  summary: z.string(),
});

export type TEsignAuditSchema = z.infer<typeof EsignAuditSchema>;
