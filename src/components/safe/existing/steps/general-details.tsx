import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export const GeneralDetailsFields = [
  "safeId",
  "valuationCap",
  "discountRate",
  "proRata",
];

export const GeneralDetails = () => {
  const form = useFormContext();

  return (
    <div className="grid-cols-2 space-y-4">
      <FormField
        control={form.control}
        name="safeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe ID</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="valuationCap"
        render={({ field }) => {
          const { onChange, ...rest } = field;
          return (
            <FormItem>
              <FormLabel>Valuation cap</FormLabel>
              <FormControl>
                <NumericFormat
                  thousandSeparator
                  allowedDecimalSeparators={["%"]}
                  decimalScale={2}
                  prefix={"$  "}
                  {...rest}
                  customInput={Input}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    onChange(floatValue);
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name="discountRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount rate (optional)</FormLabel>
            <FormControl>
              <Input
                type="text"
                {...field}
                onChange={(e) =>
                  field.onChange(Number.parseFloat(e.target.value))
                }
              />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="proRata"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="space-y-1 leading-none">
              Pro-rata rights (optional)
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};
