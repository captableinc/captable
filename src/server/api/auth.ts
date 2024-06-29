import { verifySecureHash } from "@/lib/crypto";
import { ApiError } from "@/server/api/error";
import { db } from "@/server/db";
import type { Context } from "hono";

type Headers = Context["req"]["header"];

const verifyBearerToken = async (headers: Headers) => {
  const bearerToken = headers("Authorization");
  if (!bearerToken) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "No bearer token provided",
    });
  }

  const token = bearerToken.split(" ")[1];
  if (!token) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "No bearer token provided",
    });
  }

  const [keyId, hashedToken] = token.split(":");

  if (!keyId || !hashedToken) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Invalid token provided",
    });
  }

  const apiKey = await db.apiKey.findUnique({
    where: { keyId, active: true },
    select: { id: true, keyId: true, hashedToken: true, user: true },
  });

  if (!apiKey) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Invalid token provided",
    });
  }

  const isValid = await verifySecureHash(apiKey.hashedToken, hashedToken);

  if (!isValid) {
    throw new ApiError({
      code: "UNAUTHORIZED",
      message: "Invalid token provided",
    });
  }

  await db.apiKey.update({
    where: { keyId },
    data: { lastUsed: new Date() },
  });

  return apiKey.user;
};

export const withMemberAuth = async (headers: Headers) => {
  const user = await verifyBearerToken(headers);

  const membership = await db.member.findMany({
    where: { userId: user.id, status: "ACTIVE" },
  });

  if (!membership.length) {
    throw new ApiError({
      code: "FORBIDDEN",
      message: "You do not have access to any companies",
    });
  }

  return { user, membership };
};

export const withCompanyAuth = async (id: string, headers: Headers) => {
  const user = await verifyBearerToken(headers);

  const member = await db.member.findFirst({
    where: {
      userId: user.id,
      companyId: id,
    },
  });

  if (!member) {
    throw new ApiError({
      code: "FORBIDDEN",
      message: "You do not have access to this company",
    });
  }

  const company = await db.company.findUnique({
    where: { id },
  });

  if (!company) {
    throw new ApiError({
      code: "NOT_FOUND",
      message: "Company not found",
    });
  }

  return { user, company, member };
};
