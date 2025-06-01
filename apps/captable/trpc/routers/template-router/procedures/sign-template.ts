import { withoutAuth } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { SignTemplateMutationSchema } from "../schema";

export const signTemplateProcedure = withoutAuth
  .input(SignTemplateMutationSchema)
  .mutation(({ ctx: _ctx, input: _input }) => {
    // TODO: Convert this procedure from Prisma to Drizzle ORM
    // This is a temporary stub to allow the build to pass
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message:
        "Sign template procedure is temporarily disabled during Prisma to Drizzle migration",
    });
  });
