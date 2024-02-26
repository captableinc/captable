import { ZodAddStakeholderMutationSchema } from "@/trpc/routers/stakeholder-router/schema";
import Papa, { type ParseResult } from "papaparse";
import { ZodError } from "zod";

export const parseStakeholderTextareaCSV = (csvData: string) => {
  const parsed: ParseResult<string[]> = Papa.parse(csvData, {
    header: false,
    skipEmptyLines: "greedy",
  });

  const keys = [
    "name",
    "email",
    "institutionName",
    "stakeholderType",
    "currentRelationship",
    "taxId",
    "streetAddress",
    "city",
    "state",
    "zipcode",
  ];

  const mappedCSV = parsed.data.map((csv) => {
    const values = csv.map((value, index) => {
      value = value.trim();

      // make stakeholderType and currentRelationship uppercase
      if (index === 3 || index === 4) {
        value = value.toUpperCase();
      }
      return value;
    });

    if (values.length != keys.length) {
      throw new Error(
        `Invalid values, Please make sure you have ${keys.length} values. Put "" (empty string) for the optional fields.`,
      );
    }

    const entry = Object.fromEntries(
      keys.map((key, index) => [key, values[index] ?? undefined]),
    );

    const filtered = Object.fromEntries(
      Object.entries(entry).filter(([_, value]) => value != undefined),
    );

    try {
      ZodAddStakeholderMutationSchema.parse(filtered);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.issues[0]?.message);
      }
    }

    return filtered;
  });

  // mappedCSV.forEach((csvObj) => {

  // });

  return mappedCSV;
};
