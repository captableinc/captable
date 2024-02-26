import { Road_Rage } from "next/font/google";
import Papa, { type ParseResult } from "papaparse";

export const parseStakeholderTextareaCSV = (csvData: string) => {
  const parsed: ParseResult<string[]> = Papa.parse(csvData, {
    header: false,
    skipEmptyLines: true,
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
      throw Error(
        `Invalid values, Please make sure you have ${keys.length} values. Put "" (empty string) for the optional fields.`,
      );
    }

    const entry = Object.fromEntries(
      keys.map((key, index) => [key, values[index] ?? undefined]),
    );

    const filtered = Object.fromEntries(
      Object.entries(entry).filter(([_, value]) => value != undefined),
    );

    return filtered;
  });

  return mappedCSV;
};
