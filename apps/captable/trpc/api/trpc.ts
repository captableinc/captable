/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { isSentryEnabled } from "@/lib/constants/sentry";
import { getIp, getUserAgent } from "@/lib/headers";
import { checkAccessControlMembership, getPermissions } from "@/server/member";
import { serverSideSession } from "@captable/auth/server";
import { db } from "@captable/db";
import { RBAC, type addPolicyOption } from "@captable/rbac";
import * as Sentry from "@sentry/nextjs";

export interface Meta {
  policies: addPolicyOption;
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * If you want to use Sentry, you can instrument the context like this:
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/integrations/prisma/
 * @see https://github.com/prisma/prisma/issues/6564
 */

/**
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  let session = null;

  try {
    session = await serverSideSession({ headers: opts.headers });
  } catch (_error) {
    // No session available
    session = null;
  }

  return {
    db,
    session,
    requestIp: getIp(opts.headers),
    userAgent: getUserAgent(opts.headers),
    ...opts,
  };
};

export type CreateTRPCContextType = Awaited<
  ReturnType<typeof createTRPCContext>
>;

const withAuthTrpcContext = ({ session, ...rest }: CreateTRPCContextType) => {
  if (!session || !session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return {
    ...rest,
    // infers the `session` as non-nullable
    session: { ...session, user: session.user },
  };
};

export type withAuthTrpcContextType = ReturnType<typeof withAuthTrpcContext>;

const withAccessControlTrpcContext = async ({
  meta,
  ...ctx
}: withAuthTrpcContextType & { meta: Meta | undefined }) => {
  const rbac = new RBAC();

  if (meta?.policies) {
    rbac.addPolicies(meta.policies);
  }

  const { err: permissionError, val: permission } = await getPermissions({
    db: ctx.db,
    session: ctx.session,
  });

  if (permissionError || !permission) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        permissionError instanceof Error
          ? permissionError.message
          : "Failed to get permissions",
    });
  }

  const { permissions, membership } = permission;

  const result = rbac.enforce(permissions);

  if (!result.valid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: result.message,
    });
  }

  return {
    ...ctx,
    membership,
    permissions,
  };
};

export type withAccessControlTrpcContextType = ReturnType<
  typeof withAccessControlTrpcContext
>;

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<Meta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  }),
);

const enforceAuthMiddleware = t.middleware(({ ctx: ctx_, next }) => {
  const ctx = withAuthTrpcContext(ctx_);

  const { email, id } = ctx.session.user;

  if (isSentryEnabled) {
    Sentry.setUser({ id, ...(email && { email }) });
  }

  return next({
    ctx,
  });
});

const pipedSentryMiddleware = sentryMiddleware.unstable_pipe(
  enforceAuthMiddleware,
);

const authMiddleware = isSentryEnabled
  ? pipedSentryMiddleware
  : enforceAuthMiddleware;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const withoutAuth = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const withAuth = t.procedure.use(authMiddleware);

export const withAccessControl = t.procedure.use(
  authMiddleware.unstable_pipe(async ({ ctx: ctx_, next, meta }) => {
    const ctx = await withAccessControlTrpcContext({ ...ctx_, meta });

    return next({
      ctx,
    });
  }),
);
