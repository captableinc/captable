// @ts-nocheck
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const PUBLIC_ENV_KEY = "___ENV";

function isBrowser() {
  return typeof window !== "undefined";
}

const readRuntimePublicEnvVariable = (key) => {
  if (isBrowser()) {
    return window?.[PUBLIC_ENV_KEY]?.[key];
  }

  return process.env[key];
};

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_DATABASE_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    EMAIL_SERVER: z.string().optional(),
    EMAIL_FROM: z.string(),

    // upload
    UPLOAD_ENDPOINT: z.string(),
    UPLOAD_REGION: z.string(),
    UPLOAD_BUCKET_PUBLIC: z.string(),
    UPLOAD_BUCKET_PRIVATE: z.string(),
    UPLOAD_ACCESS_KEY_ID: z.string().optional(),
    UPLOAD_SECRET_ACCESS_KEY: z.string().optional(),

    // google
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // stripe
    STRIPE_API_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_UPLOAD_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: readRuntimePublicEnvVariable("NEXT_PUBLIC_BASE_URL"),
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,

    UPLOAD_ENDPOINT: process.env.UPLOAD_ENDPOINT,
    UPLOAD_REGION: process.env.UPLOAD_REGION,
    UPLOAD_BUCKET_PUBLIC: process.env.UPLOAD_BUCKET_PUBLIC,
    UPLOAD_BUCKET_PRIVATE: process.env.UPLOAD_BUCKET_PRIVATE,
    UPLOAD_ACCESS_KEY_ID: process.env.UPLOAD_ACCESS_KEY_ID,
    UPLOAD_SECRET_ACCESS_KEY: process.env.UPLOAD_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_UPLOAD_DOMAIN: readRuntimePublicEnvVariable(
      "NEXT_PUBLIC_UPLOAD_DOMAIN",
    ),

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: readRuntimePublicEnvVariable(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    ),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  onValidationError: (error) => {
    if (!isBrowser()) {
      console.error(
        "❌ Invalid environment variables:",
        error.flatten().fieldErrors,
      );
      throw new Error("Invalid environment variables");
    }
  },
});
