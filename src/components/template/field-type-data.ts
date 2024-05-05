import { type FieldTypes } from "@/prisma/enums";
import { RiCalendar2Line, RiSketching, RiText } from "@remixicon/react";

interface OptionsItems {
  label: string;
  icon: typeof RiSketching;
  value: FieldTypes;
}

export const FieldTypeData: OptionsItems[] = [
  {
    label: "Signature",
    icon: RiSketching,
    value: "SIGNATURE",
  },
  {
    label: "Text",
    icon: RiText,
    value: "TEXT",
  },
  {
    label: "Date",
    icon: RiCalendar2Line,
    value: "DATE",
  },
];
