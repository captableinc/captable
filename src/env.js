import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// https://env.t3.gg/docs/recipes#booleans
const COERCED_BOOLEAN = z
  .string()
  // transform to boolean using preferred coercion logic
  .transform((s) => s !== 'false' && s !== '0')

// const ONLY_BOOLEAN = z
//   .string()
//   // only allow "true" or "false"
//   .refine((s) => s === "true" || s === "false")
//   // transform to boolean
//   .transform((s) => s === "true");

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    BASE_URL: z.string().url(),
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes('YOUR_DATABASE_URL_HERE'),
        'You forgot to change the default URL',
      ),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    EMAIL_SERVER: z.string().optional(),
    EMAIL_FROM: z.string(),

    /// smtp

    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_SERVER_SECURE: COERCED_BOOLEAN,
    EMAIL_SERVER_USERNAME: z.string().optional(),
    EMAIL_SERVER_PASSWORD: z.string().optional(),

    //flags

    // upload

    UPLOAD_ENDPOINT: z.string(),
    UPLOAD_REGION: z.string(),
    UPLOAD_BUCKET_PUBLIC: z.string(),
    UPLOAD_BUCKET_PRIVATE: z.string(),
    UPLOAD_ACCESS_KEY_ID: z.string().optional(),
    UPLOAD_SECRET_ACCESS_KEY: z.string().optional(),
    UPLOAD_PROVIDER: z.enum(['s3', 'r2']),

    // google
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // trigger.dev
    TRIGGER_API_ID: z.string(),
    TRIGGER_API_KEY: z.string().optional(),
    TRIGGER_API_URL: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_NODE_ENV: z.string().default('development'),
    NEXT_PUBLIC_UPLOAD_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,

    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_SECURE: process.env.EMAIL_SERVER_SECURE,
    EMAIL_SERVER_USERNAME: process.env.EMAIL_SERVER_USERNAME,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,

    UPLOAD_ENDPOINT: process.env.UPLOAD_ENDPOINT,
    UPLOAD_REGION: process.env.UPLOAD_REGION,
    UPLOAD_BUCKET_PUBLIC: process.env.UPLOAD_BUCKET_PUBLIC,
    UPLOAD_BUCKET_PRIVATE: process.env.UPLOAD_BUCKET_PRIVATE,
    UPLOAD_ACCESS_KEY_ID: process.env.UPLOAD_ACCESS_KEY_ID,
    UPLOAD_SECRET_ACCESS_KEY: process.env.UPLOAD_SECRET_ACCESS_KEY,
    UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER,
    NEXT_PUBLIC_UPLOAD_DOMAIN: process.env.NEXT_PUBLIC_UPLOAD_DOMAIN,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    TRIGGER_API_ID: process.env.TRIGGER_API_ID,
    TRIGGER_API_KEY: process.env.TRIGGER_API_KEY,
    TRIGGER_API_URL: process.env.TRIGGER_API_URL,
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY,
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
})
