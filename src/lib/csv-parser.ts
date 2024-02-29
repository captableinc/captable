import { ZodAddStakeholderMutationSchema } from "@/trpc/routers/stakeholder-router/schema";
import Papa, { type ParseResult } from "papaparse";
import { ZodError } from "zod";

export const parseCSV = async (csvFile: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const csvData = event.target?.result as string;
      const parsed: ParseResult<string[]> = Papa.parse(csvData, {
        skipEmptyLines: true,
        comments:
          "Full name,Email,Institution name,Type,Association,Tax ID,Street address,City,State,Postal code",
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
          reject(
            new Error(
              `Invalid values, Please make sure you have ${keys.length} values. You can put "" (empty string) for the optional fields.`,
            ),
          );
          return;
        }

        const entry = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          keys.map((key, index) => [key, values[index] || undefined]),
        );

        const filtered = Object.fromEntries(
          Object.entries(entry).filter(([_, value]) => value !== undefined),
        );

        return filtered;
      });

      mappedCSV.forEach((csv) => {
        try {
          ZodAddStakeholderMutationSchema.parse(csv);
        } catch (error) {
          if (error instanceof ZodError) {
            return new Error(error.issues[0]?.message);
          }
        }
      });

      resolve(mappedCSV);
    };

    reader.onerror = function () {
      reject(new Error("Error reading the file"));
    };

    reader.readAsText(csvFile);
  });
};
