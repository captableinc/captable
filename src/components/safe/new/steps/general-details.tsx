import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SafeTemplateEnum } from "@/prisma/enums";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export const GeneralDetailsFields = [
  "safeId",
  "safeTemplate",
  "valuationCap",
  "discountRate",
  "proRata",
];

export const GeneralDetails = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
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
        name="safeTemplate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe template</FormLabel>
            {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {
                  //eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
                  Object.entries(SafeTemplateEnum).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
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
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
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
              <Checkbox
                checked={field.value as boolean}
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
