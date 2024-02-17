/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { render } from "jsx-email";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/server/db";
import { env } from "@/env";
import { sendMail } from "./mailer";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { type MEMBERSHIP_ACCESS } from "@/prisma-enums";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isOnboarded: boolean;
      companyId: string;
      membershipId: string;
      companyPublicId: string;
      access: MEMBERSHIP_ACCESS;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isOnboarded: boolean;
    companyId: string;
    membershipId: string;
    companyPublicId: string;
    access: MEMBERSHIP_ACCESS;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      session.user.isOnboarded = token.isOnboarded;
      session.user.companyId = token.companyId;
      session.user.membershipId = token.membershipId;
      session.user.companyPublicId = token.companyPublicId;
      session.user.access = token.access;

      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },

    async jwt({ token, trigger }) {
      if (trigger) {
        const membership = await db.membership.findFirst({
          where: {
            userId: token.sub,
            isOnboarded: true,
            status: "ACCEPTED",
          },
          orderBy: {
            lastAccessed: "desc",
          },
          select: {
            id: true,
            companyId: true,
            isOnboarded: true,
            access: true,
            user: {
              select: {
                name: true,
              },
            },
            company: {
              select: {
                publicId: true,
              },
            },
          },
        });

        if (membership) {
          token.isOnboarded = membership.isOnboarded;
          token.companyId = membership.companyId;
          token.membershipId = membership.id;
          token.name = membership.user?.name;
          token.companyPublicId = membership.company.publicId;
          token.access = membership.access;
        } else {
          token.isOnboarded = false;
          token.companyId = "";
          token.membershipId = "";
          token.companyPublicId = "";
          token.access = "STAKEHOLDER";
        }
      }

      return token;
    },

    async signIn() {
      const allowLogin: boolean = env.WAITLIST_MODE === "off";

      return allowLogin || "/signup";
    },
  },
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET ?? "secret",
  session: {
    strategy: "jwt",
  },
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        if (env.NODE_ENV === "development") {
          console.log(`🔑 Login link: ${url}`);
        }

        const html = await render(
          MagicLinkEmail({
            magicLink: url,
          }),
        );

        await sendMail({
          to: identifier,
          subject: "Your OpenCap Login Link",
          html,
        });
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/login",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

export const withServerSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("session not found");
  }

  return session;
};
