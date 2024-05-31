import { SecuritiesStatusEnum } from "@prisma/client";
import { capitalize } from "lodash-es";

export const statusValues = Object.keys(SecuritiesStatusEnum).map((item) => ({
  label: capitalize(item),
  value: item,
}));
