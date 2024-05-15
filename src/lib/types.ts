import { z } from "zod";
import { type PayloadType } from "./constants";

type ProfilePayload = {
  type: PayloadType.PROFILE_DATA;
  payload: {
    fullName: string;
    jobTitle: string;
    loginEmail: string;
    workEmail: string;
  };
};

type AvatarPayload = {
  type: PayloadType.PROFILE_AVATAR;
  payload: {
    avatarUrl: string;
  };
};

export type RootPayload = ProfilePayload | AvatarPayload;

export type MemberProfile = {
  fullName: string;
  jobTitle: string;
  loginEmail: string;
  workEmail: string;
  avatarUrl: string;
};

const ZClientExtensionResults = z.object({
  appid: z.boolean().optional(),
  credProps: z
    .object({
      rk: z.boolean().optional(),
    })
    .optional(),
  hmacCreateSecret: z.boolean().optional(),
});

export const ZAuthenticationResponseJSONSchema = z.object({
  id: z.string(),
  rawId: z.string(),
  response: z.object({
    clientDataJSON: z.string(),
    authenticatorData: z.string(),
    signature: z.string(),
    userHandle: z.string().optional(),
  }),
  authenticatorAttachment: z
    .union([z.literal("cross-platform"), z.literal("platform")])
    .optional(),
  clientExtensionResults: ZClientExtensionResults,
  type: z.literal("public-key"),
});

export const ZRegistrationResponseJSONSchema = z.object({
  id: z.string(),
  rawId: z.string(),
  response: z.object({
    clientDataJSON: z.string(),
    attestationObject: z.string(),
    authenticatorData: z.string().optional(),
    transports: z.array(z.string()).optional(),
    publicKeyAlgorithm: z.number().optional(),
    publicKey: z.string().optional(),
  }),
  authenticatorAttachment: z.string().optional(),
  clientExtensionResults: ZClientExtensionResults.optional(),
  type: z.string(),
});

export type TAuthenticationResponseJSONSchema = z.infer<
  typeof ZAuthenticationResponseJSONSchema
>;
export type TRegistrationResponseJSONSchema = z.infer<
  typeof ZRegistrationResponseJSONSchema
>;
