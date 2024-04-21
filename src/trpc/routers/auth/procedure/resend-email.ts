import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { getVerificationTokenByEmail } from "@/server/verification-token";
import { publicProcedure } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const resendEmailProcedure = publicProcedure
  .input(z.string().email())
  .mutation(async ({ input }) => {
    const oldVerificationToken = await getVerificationTokenByEmail(input);

    if (!oldVerificationToken) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Email not found!",
      });
    }
    const verificationToken = await generateVerificationToken(input);
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );
    return {
      success: true,
      message:
        "To verify your account, please click the verification link sent to your email.",
    };
  });
