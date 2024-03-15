import { capitalize } from "lodash-es";
import { MemberStatusEnum } from "@/prisma-enums";

export const statusValues = Object.keys(MemberStatusEnum).map((item) => ({
  label: capitalize(item),
  value: item,
}));
