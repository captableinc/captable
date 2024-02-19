import { capitalize } from "lodash-es";
import { MembershipStatusEnum } from "@prisma/client";

export const statusValues = Object.keys(MembershipStatusEnum).map((item) => ({
  label: capitalize(item),
  value: item,
}));
