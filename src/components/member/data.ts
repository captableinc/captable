import { capitalize } from "lodash-es";
import { MemberStatusEnum } from "@prisma/client";

export const statusValues = Object.keys(MemberStatusEnum).map((item) => ({
  label: capitalize(item),
  value: item,
}));
