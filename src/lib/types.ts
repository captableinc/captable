import { type UpdateEmailStatusEnum } from "@/prisma-enums";
import { type RouterOutputs } from "@/trpc/shared";
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

export type Recipient = {
  stakeholder: {
    name: string;
  };
  status: UpdateEmailStatusEnum;
  stakeholderId: string;
  sentAt: Date | null;
};

export type Stakeholder = {
  id: string;
  name: string;
  email: string;
};

export type Stakeholders =
  RouterOutputs["stakeholder"]["getStakeholders"]["data"];
