"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StepperModalFooter,
  StepperPrev,
  useStepper,
} from "@/components/ui/stepper";
import {
  ConvertibleInterestAccrualEnum,
  ConvertibleInterestMethodEnum,
  ConvertibleInterestPaymentScheduleEnum,
  ConvertibleTypeEnum,
} from "@/prisma/enums";
import { useFormValueUpdater } from "@/providers/form-value-provider";

const InterestMethodOption: Record<ConvertibleInterestMethodEnum, string> = {
  COMPOUND: "Compound",
  SIMPLE: "Simple",
};

const TypeOption: Record<ConvertibleTypeEnum, string> = {
  CCD: "Compulsory Convertible Debenture",
  NOTE: "Simple Convertible note",
  OCD: "Optionally Convertible Debenture",
};

const InterestPaymentScheduleOption: Record<
  ConvertibleInterestPaymentScheduleEnum,
  string
> = {
  DEFERRED: "Deferred",
  PAY_AT_MATURITY: "Pay-At-Maturity",
};

const InterestAccrualOption: Record<ConvertibleInterestAccrualEnum, string> = {
  ANNUALLY: "Annually",
  CONTINUOUSLY: "Continuously",
  DAILY: "Daily",
  MONTHLY: "Monthly",
  SEMI_ANNUALLY: "Semi-Annually",
  YEARLY: "Yearly",
};

const Schema = z.object({
  capital: z.coerce.number(),
  issueDate: z.string().date(),
  boardApprovalDate: z.string().date(),
  additionalTerms: z.string().optional(),
  conversionCap: z.coerce.number().optional(),
  discountRate: z.coerce.number().optional(),
  interestRate: z.coerce.number().optional(),
  interestMethod: z.nativeEnum(ConvertibleInterestMethodEnum).optional(),
  interestAccrual: z.nativeEnum(ConvertibleInterestAccrualEnum).optional(),
  interestPaymentSchedule: z
    .nativeEnum(ConvertibleInterestPaymentScheduleEnum)
    .optional(),
  type: z.nativeEnum(ConvertibleTypeEnum),
});

type TFormSchema = z.infer<typeof Schema>;

export function AddConvertibleNotesForm() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(Schema),
  });
  const setValue = useFormValueUpdater<TFormSchema>();
  const { next } = useStepper();

  const onSubmit = (data: TFormSchema) => {
    next();
    setValue(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="capital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capital</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conversionCap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conversion capital</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Rate</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(TypeOption).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(InterestMethodOption).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestAccrual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Accrual</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(InterestAccrualOption).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestPaymentSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Payment Schedule</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(InterestPaymentScheduleOption).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boardApprovalDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board approval date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="additionalTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Terms</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <StepperModalFooter className="pt-6">
          <StepperPrev>Back</StepperPrev>
          <Button type="submit">Save & Continue</Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
}
