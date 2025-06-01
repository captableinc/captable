import { relations } from "drizzle-orm";
import { accessTokens } from "./access-tokens";
import { accounts } from "./accounts";
import { audits } from "./audits";
import { bankAccounts } from "./bank-accounts";
import {
  billingCustomers,
  billingPrices,
  billingProducts,
  billingSubscriptions,
} from "./billing";
import { buckets } from "./buckets";
import { companies } from "./companies";
import { convertibleNotes } from "./convertible-notes";
import {
  dataRoomDocuments,
  dataRoomRecipients,
  dataRooms,
  updateRecipients,
} from "./data-rooms";
import { documents } from "./documents";
import { documentShares } from "./documents";
import { equityPlans } from "./equity-plans";
import { investments } from "./investments";
import { members } from "./members";
import { customRoles } from "./members";
import { options } from "./options";
import { passkeys } from "./passkeys";
import { safes } from "./safes";
import { sessions } from "./sessions";
import { shareClasses } from "./share-classes";
import { shares } from "./shares";
import { stakeholders } from "./stakeholders";
import { esignRecipients, templateFields, templates } from "./templates";
import { updates } from "./updates";
import { esignAudits } from "./updates";
import { users } from "./users";
import {
  passkeyVerificationTokens,
  passwordResetTokens,
  verificationTokens,
} from "./verification-tokens";

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  memberships: many(members),
  passkeys: many(passkeys),
  verificationTokens: many(verificationTokens),
  accessTokens: many(accessTokens),
}));

// Account relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Session relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Verification token relations
export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  }),
);

// Passkey relations
export const passkeysRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));

// Access token relations
export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  user: one(users, {
    fields: [accessTokens.userId],
    references: [users.id],
  }),
}));

// Company relations
export const companiesRelations = relations(companies, ({ many }) => ({
  bankAccounts: many(bankAccounts),
  users: many(members),
  audits: many(audits),
  shareClasses: many(shareClasses),
  equityPlans: many(equityPlans),
  documents: many(documents),
  templates: many(templates),
  stakeholders: many(stakeholders),
  investments: many(investments),
  shares: many(shares),
  options: many(options),
  safes: many(safes),
  convertibleNotes: many(convertibleNotes),
  dataRooms: many(dataRooms),
  eSignAudits: many(esignAudits),
  billingCustomers: many(billingCustomers),
  customRoles: many(customRoles),
  updates: many(updates),
}));

// Bank Account relations
export const bankAccountsRelations = relations(bankAccounts, ({ one }) => ({
  company: one(companies, {
    fields: [bankAccounts.companyId],
    references: [companies.id],
  }),
}));

// Member relations
export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [members.companyId],
    references: [companies.id],
  }),
  customRole: one(customRoles, {
    fields: [members.customRoleId],
    references: [customRoles.id],
  }),
  documentReceived: many(esignRecipients),
  documents: many(documents),
  templates: many(templates),
  updates: many(updates),
  dataRooms: many(dataRoomRecipients),
  updateRecipients: many(updateRecipients),
}));

// Custom Role relations
export const customRolesRelations = relations(customRoles, ({ one, many }) => ({
  company: one(companies, {
    fields: [customRoles.companyId],
    references: [companies.id],
  }),
  members: many(members),
}));

// Stakeholder relations
export const stakeholdersRelations = relations(
  stakeholders,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [stakeholders.companyId],
      references: [companies.id],
    }),
    investments: many(investments),
    shares: many(shares),
    options: many(options),
    safes: many(safes),
    convertibleNotes: many(convertibleNotes),
    updates: many(updateRecipients),
    dataRooms: many(dataRoomRecipients),
  }),
);

// Audit relations
export const auditsRelations = relations(audits, ({ one }) => ({
  company: one(companies, {
    fields: [audits.companyId],
    references: [companies.id],
  }),
}));

// Share Class relations
export const shareClassesRelations = relations(
  shareClasses,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [shareClasses.companyId],
      references: [companies.id],
    }),
    equityPlans: many(equityPlans),
    investments: many(investments),
    shares: many(shares),
  }),
);

// Equity Plan relations
export const equityPlansRelations = relations(equityPlans, ({ one, many }) => ({
  company: one(companies, {
    fields: [equityPlans.companyId],
    references: [companies.id],
  }),
  shareClass: one(shareClasses, {
    fields: [equityPlans.shareClassId],
    references: [shareClasses.id],
  }),
  options: many(options),
}));

// Bucket relations
export const bucketsRelations = relations(buckets, ({ many }) => ({
  documents: many(documents),
  templates: many(templates),
}));

// Document relations
export const documentsRelations = relations(documents, ({ one, many }) => ({
  bucket: one(buckets, {
    fields: [documents.bucketId],
    references: [buckets.id],
  }),
  uploader: one(members, {
    fields: [documents.uploaderId],
    references: [members.id],
  }),
  company: one(companies, {
    fields: [documents.companyId],
    references: [companies.id],
  }),
  share: one(shares, {
    fields: [documents.shareId],
    references: [shares.id],
  }),
  option: one(options, {
    fields: [documents.optionId],
    references: [options.id],
  }),
  safe: one(safes, {
    fields: [documents.safeId],
    references: [safes.id],
  }),
  convertibleNote: one(convertibleNotes, {
    fields: [documents.convertibleNoteId],
    references: [convertibleNotes.id],
  }),
  dataRooms: many(dataRoomDocuments),
  documentShares: many(documentShares),
}));

// Document Share relations
export const documentSharesRelations = relations(documentShares, ({ one }) => ({
  document: one(documents, {
    fields: [documentShares.documentId],
    references: [documents.id],
  }),
}));

// Data Room relations
export const dataRoomsRelations = relations(dataRooms, ({ one, many }) => ({
  company: one(companies, {
    fields: [dataRooms.companyId],
    references: [companies.id],
  }),
  documents: many(dataRoomDocuments),
  recipients: many(dataRoomRecipients),
}));

// Data Room Document relations
export const dataRoomDocumentsRelations = relations(
  dataRoomDocuments,
  ({ one }) => ({
    dataRoom: one(dataRooms, {
      fields: [dataRoomDocuments.dataRoomId],
      references: [dataRooms.id],
    }),
    document: one(documents, {
      fields: [dataRoomDocuments.documentId],
      references: [documents.id],
    }),
  }),
);

// Data Room Recipient relations
export const dataRoomRecipientsRelations = relations(
  dataRoomRecipients,
  ({ one }) => ({
    dataRoom: one(dataRooms, {
      fields: [dataRoomRecipients.dataRoomId],
      references: [dataRooms.id],
    }),
    member: one(members, {
      fields: [dataRoomRecipients.memberId],
      references: [members.id],
    }),
    stakeholder: one(stakeholders, {
      fields: [dataRoomRecipients.stakeholderId],
      references: [stakeholders.id],
    }),
  }),
);

// Update relations
export const updatesRelations = relations(updates, ({ one, many }) => ({
  author: one(members, {
    fields: [updates.authorId],
    references: [members.id],
  }),
  company: one(companies, {
    fields: [updates.companyId],
    references: [companies.id],
  }),
  recipients: many(updateRecipients),
}));

// Update Recipient relations
export const updateRecipientsRelations = relations(
  updateRecipients,
  ({ one }) => ({
    update: one(updates, {
      fields: [updateRecipients.updateId],
      references: [updates.id],
    }),
    member: one(members, {
      fields: [updateRecipients.memberId],
      references: [members.id],
    }),
    stakeholder: one(stakeholders, {
      fields: [updateRecipients.stakeholderId],
      references: [stakeholders.id],
    }),
  }),
);

// Share relations
export const sharesRelations = relations(shares, ({ one, many }) => ({
  stakeholder: one(stakeholders, {
    fields: [shares.stakeholderId],
    references: [stakeholders.id],
  }),
  company: one(companies, {
    fields: [shares.companyId],
    references: [companies.id],
  }),
  shareClass: one(shareClasses, {
    fields: [shares.shareClassId],
    references: [shareClasses.id],
  }),
  documents: many(documents),
}));

// Option relations
export const optionsRelations = relations(options, ({ one, many }) => ({
  stakeholder: one(stakeholders, {
    fields: [options.stakeholderId],
    references: [stakeholders.id],
  }),
  company: one(companies, {
    fields: [options.companyId],
    references: [companies.id],
  }),
  equityPlan: one(equityPlans, {
    fields: [options.equityPlanId],
    references: [equityPlans.id],
  }),
  documents: many(documents),
}));

// Investment relations
export const investmentsRelations = relations(investments, ({ one }) => ({
  shareClass: one(shareClasses, {
    fields: [investments.shareClassId],
    references: [shareClasses.id],
  }),
  company: one(companies, {
    fields: [investments.companyId],
    references: [companies.id],
  }),
  stakeholder: one(stakeholders, {
    fields: [investments.stakeholderId],
    references: [stakeholders.id],
  }),
}));

// Safe relations
export const safesRelations = relations(safes, ({ one, many }) => ({
  stakeholder: one(stakeholders, {
    fields: [safes.stakeholderId],
    references: [stakeholders.id],
  }),
  company: one(companies, {
    fields: [safes.companyId],
    references: [companies.id],
  }),
  documents: many(documents),
}));

// Convertible Note relations
export const convertibleNotesRelations = relations(
  convertibleNotes,
  ({ one, many }) => ({
    stakeholder: one(stakeholders, {
      fields: [convertibleNotes.stakeholderId],
      references: [stakeholders.id],
    }),
    company: one(companies, {
      fields: [convertibleNotes.companyId],
      references: [companies.id],
    }),
    documents: many(documents),
  }),
);

// Template relations
export const templatesRelations = relations(templates, ({ one, many }) => ({
  bucket: one(buckets, {
    fields: [templates.bucketId],
    references: [buckets.id],
  }),
  uploader: one(members, {
    fields: [templates.uploaderId],
    references: [members.id],
  }),
  company: one(companies, {
    fields: [templates.companyId],
    references: [companies.id],
  }),
  fields: many(templateFields),
  eSignRecipient: many(esignRecipients),
  eSignAudits: many(esignAudits),
}));

// ESign Recipient relations
export const esignRecipientsRelations = relations(
  esignRecipients,
  ({ one, many }) => ({
    template: one(templates, {
      fields: [esignRecipients.templateId],
      references: [templates.id],
    }),
    member: one(members, {
      fields: [esignRecipients.memberId],
      references: [members.id],
    }),
    templateFields: many(templateFields),
    eSignAudits: many(esignAudits),
  }),
);

// Template Field relations
export const templateFieldsRelations = relations(templateFields, ({ one }) => ({
  recipient: one(esignRecipients, {
    fields: [templateFields.recipientId],
    references: [esignRecipients.id],
  }),
  template: one(templates, {
    fields: [templateFields.templateId],
    references: [templates.id],
  }),
}));

// ESign Audit relations
export const esignAuditsRelations = relations(esignAudits, ({ one }) => ({
  company: one(companies, {
    fields: [esignAudits.companyId],
    references: [companies.id],
  }),
  template: one(templates, {
    fields: [esignAudits.templateId],
    references: [templates.id],
  }),
  recipient: one(esignRecipients, {
    fields: [esignAudits.recipientId],
    references: [esignRecipients.id],
  }),
}));

// Billing Customer relations
export const billingCustomersRelations = relations(
  billingCustomers,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [billingCustomers.companyId],
      references: [companies.id],
    }),
    subscriptions: many(billingSubscriptions),
  }),
);

// Billing Product relations
export const billingProductsRelations = relations(
  billingProducts,
  ({ many }) => ({
    prices: many(billingPrices),
  }),
);

// Billing Price relations
export const billingPricesRelations = relations(
  billingPrices,
  ({ one, many }) => ({
    product: one(billingProducts, {
      fields: [billingPrices.productId],
      references: [billingProducts.id],
    }),
    subscriptions: many(billingSubscriptions),
  }),
);

// Billing Subscription relations
export const billingSubscriptionsRelations = relations(
  billingSubscriptions,
  ({ one }) => ({
    price: one(billingPrices, {
      fields: [billingSubscriptions.priceId],
      references: [billingPrices.id],
    }),
    customer: one(billingCustomers, {
      fields: [billingSubscriptions.customerId],
      references: [billingCustomers.id],
    }),
  }),
);

// Password Reset Token relations
export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  () => ({}),
);

// Passkey Verification Token relations
export const passkeyVerificationTokensRelations = relations(
  passkeyVerificationTokens,
  () => ({}),
);
