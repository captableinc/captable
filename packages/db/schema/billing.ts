import { createId } from "@paralleldrive/cuid2";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import {
  PricingPlanIntervalEnum,
  PricingTypeEnum,
  SubscriptionStatusEnum,
} from "./enums";
import { createTable } from "./index";

export const billingProducts = createTable("billing_products", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  active: boolean("active").notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  description: varchar("description", { length: 191 }),
  metadata: jsonb("metadata"),
});

export const BillingProductSchema = createSelectSchema(billingProducts);
export type BillingProduct = typeof billingProducts.$inferSelect;

export const billingPrices = createTable(
  "billing_prices",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    productId: varchar("product_id", { length: 191 }).notNull(),
    active: boolean("active").notNull(),
    description: varchar("description", { length: 191 }),
    unitAmount: bigint("unit_amount", { mode: "number" }),
    currency: varchar("currency", { length: 3 }).notNull(),
    type: PricingTypeEnum("type").notNull(),
    interval: PricingPlanIntervalEnum("interval"),
    intervalCount: integer("interval_count"),
    trialPeriodDays: integer("trial_period_days"),
    metadata: jsonb("metadata"),
  },
  (table) => {
    return [
      // Mirroring index from Prisma schema
      index("billing_prices_product_id_idx").on(table.productId),
    ];
  },
);

export const BillingPriceSchema = createSelectSchema(billingPrices);
export type BillingPrice = typeof billingPrices.$inferSelect;

export const billingSubscriptions = createTable(
  "billing_subscriptions",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    priceId: varchar("price_id", { length: 191 }).notNull(),
    quantity: integer("quantity").notNull(),
    status: SubscriptionStatusEnum("status").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull(),

    // Dates
    created: timestamp("created", { withTimezone: true })
      .notNull()
      .defaultNow(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    cancelAt: timestamp("cancel_at", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    trialStart: timestamp("trial_start", { withTimezone: true }),
    trialEnd: timestamp("trial_end", { withTimezone: true }),

    metadata: jsonb("metadata"),

    // Foreign key reference
    customerId: varchar("customer_id", { length: 191 }).notNull(),
  },
  (table) => {
    return [
      // Mirroring indexes from Prisma schema
      index("billing_subscriptions_price_id_idx").on(table.priceId),
      index("billing_subscriptions_customer_id_idx").on(table.customerId),
    ];
  },
);

export const BillingSubscriptionSchema =
  createSelectSchema(billingSubscriptions);
export type BillingSubscription = typeof billingSubscriptions.$inferSelect;

export const billingCustomers = createTable(
  "billing_customers",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    companyId: varchar("company_id", { length: 191 }),
  },
  (table) => {
    return [
      // Mirroring index from Prisma schema
      index("billing_customers_company_id_idx").on(table.companyId),
    ];
  },
);

export const BillingCustomerSchema = createSelectSchema(billingCustomers);
export type BillingCustomer = typeof billingCustomers.$inferSelect;
