"use client";

import { Button } from "@/components/ui/button";
import { LinearCombobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  StepperModalFooter,
  StepperPrev,
  useStepper,
} from "@/components/ui/stepper";
import { toTitleCase } from "@/lib/string";
import { useStockOptionFormValues } from "@/providers/stock-option-form-provider";
import { OptionStatusEnum, OptionTypeEnum } from "@captable/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

const STATUSES = Object.values(OptionStatusEnum).map((val: string) => ({
  label: toTitleCase(val),
  value: val,
}));
const TYPES = Object.values(OptionTypeEnum) as [string, ...string[]];
const typesOpts = TYPES.map((type) => ({ value: type, label: type }));
const formSchema = z.object({
  grantId: z.string(),
  quantity: z.coerce.number().min(0),
  type: z.enum(OptionTypeEnum.enumValues as [string, ...string[]]),
  status: z.enum(OptionStatusEnum.enumValues as [string, ...string[]]),
});

type TFormSchema = z.infer<typeof formSchema>;

export const GeneralDetails = () => {
  const { next } = useStepper();
  const { setValue } = useStockOptionFormValues();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: TFormSchema) => {
    setValue(data);
    next();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="grantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grant ID</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grant type</FormLabel>
                <div>
                  <LinearCombobox
                    options={typesOpts}
                    onValueChange={(option) => field.onChange(option.value)}
                  />
                </div>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => {
              const { onChange, ...rest } = field;
              return (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <NumericFormat
                      thousandSeparator
                      allowedDecimalSeparators={["%"]}
                      decimalScale={2}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <div>
                  <LinearCombobox
                    options={STATUSES}
                    onValueChange={(option) => field.onChange(option.value)}
                  />
                </div>

                {/* <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.label} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
        </div>
        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button type="submit">Save & Continue</Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
};
