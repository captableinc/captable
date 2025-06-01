import { db, schema } from "@captable/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.betterAuthUsers,
      session: schema.betterAuthSessions,
      account: schema.betterAuthAccounts,
      verification: schema.betterAuthVerifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  session: {
    cookieCache: {
      enabled: false,
    },
  },

  advanced: {
    cookiePrefix: "captable",
  },

  plugins: [
    // This should be at the very bottom of the plugins array
    nextCookies(),
  ],
});
