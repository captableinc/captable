import { MEMBERSHIP_ACCESS, MEMBERHIP_STATUS } from "@prisma/client";

export const accessValues = Object.keys(MEMBERSHIP_ACCESS).map((item) => ({
  label: item,
  value: item,
}));

export const statusValues = Object.keys(MEMBERHIP_STATUS).map((item) => ({
  label: item,
  value: item,
}));
