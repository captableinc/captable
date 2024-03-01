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
import { type MemberStatusEnum } from "@/prisma-enums";

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
      memberId: string;
      companyPublicId: string;
      status: MemberStatusEnum | "";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    companyId: string;
    memberId: string;
    isOnboarded: boolean;
    companyPublicId: string;
    status: MemberStatusEnum | "";
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
      session.user.memberId = token.memberId;
      session.user.companyPublicId = token.companyPublicId;
      session.user.status = token.status;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture ?? "";

      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt({ token, trigger, session }) {
      if (trigger === "update") {
        const newToken = {
          ...token,
          ...session?.user,
          picture: session?.user?.image || "",
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return newToken;
      }

      if (trigger) {
        const member = await db.member.findFirst({
          where: {
            userId: token.sub,
            isOnboarded: true,
            status: "ACTIVE",
          },
          orderBy: {
            lastAccessed: "desc",
          },
          select: {
            id: true,
            status: true,
            companyId: true,
            isOnboarded: true,
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

        if (member) {
          token.status = member.status;
          token.name = member.user?.name;
          token.memberId = member.id;
          token.companyId = member.companyId;
          token.isOnboarded = member.isOnboarded;
          token.companyPublicId = member.company.publicId;
        } else {
          token.status = "";
          token.companyId = "";
          token.memberId = "";
          token.isOnboarded = false;
          token.companyPublicId = "";
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
