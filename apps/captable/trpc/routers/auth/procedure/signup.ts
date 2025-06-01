import { env } from "@/env";
import { sendAuthVerificationEmail } from "@/jobs/auth-verification-email";

import { generateVerificationToken } from "@/lib/token";
import { Audit } from "@/server/audit";
import { withoutAuth } from "@/trpc/api/trpc";
import { db, eq, users } from "@captable/db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { ZSignUpMutationSchema } from "../schema";

export const signupProcedure = withoutAuth
  .input(ZSignUpMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { name, email, password } = input;
    const { userAgent, requestIp } = ctx;

    const userExists = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (userExists) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        lastSignedIn: new Date(),
      })
      .returning();

    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
      });
    }

    await Audit.create(
      {
        action: "user.signed-up",
        companyId: "",
        actor: { type: "user", id: user.id },
        context: {
          userAgent,
          requestIp: requestIp || "",
        },
        target: [{ type: "user", id: user.id }],
        summary: `${user.name} has created the Account`,
      },
      db,
    );

    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate verification token",
      });
    }

    const verifyLink = `${env.NEXT_PUBLIC_BASE_URL}/verify-email/${verificationToken.token}`;

    await sendAuthVerificationEmail({
      email: verificationToken.identifier,
      verifyLink,
    });

    return {
      success: true,
      message: "Please check your email to verify your account.",
    };
  });
