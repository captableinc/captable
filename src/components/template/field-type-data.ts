import type { FieldTypes } from "@/prisma/enums";

import type { IconName } from "../ui/icon";

interface OptionsItems {
  label: string;
  icon: IconName;
  value: FieldTypes;
}

export const FieldTypeData: OptionsItems[] = [
  {
    label: "Signature",
    icon: "sketching",
    value: "SIGNATURE",
  },
  {
    label: "Text",
    icon: "text",
    value: "TEXT",
  },
  {
    label: "Date",
    icon: "calendar-2-line",
    value: "DATE",
  },
  {
    label: "Select",
    icon: "list-check-3",
    value: "SELECT",
  },
];
