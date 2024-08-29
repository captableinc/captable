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
import { LinearCombobox } from "@/components/ui/combobox";
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
import type { RouterOutputs } from "@/trpc/shared";
import { RiAddCircleLine } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  mfn: z.boolean().optional(),
  stakeholderId: z.string(),
});

export type TFormSchema = z.infer<typeof Schema>;

interface AddConvertibleNotesFormProps {
  stakeholders: RouterOutputs["stakeholder"]["getStakeholders"];
}

export function AddConvertibleNotesForm({
  stakeholders,
}: AddConvertibleNotesFormProps) {
  const { data: session } = useSession();

  const router = useRouter();
  const form = useForm<TFormSchema>({
    resolver: zodResolver(Schema),
  });
  const setValue = useFormValueUpdater<TFormSchema>();
  const { next } = useStepper();

  const onSubmit = (data: TFormSchema) => {
    next();
    setValue(data);
  };

  const stakeHolderOpts = stakeholders?.map((sh) => ({
    value: sh.id,
    label: sh.institutionName ? `${sh.institutionName} - ${sh.name}` : sh.name,
  }));

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
            name="stakeholderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stakeholder</FormLabel>
                <div>
                  <LinearCombobox
                    options={stakeHolderOpts}
                    onChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <button
                      type="button"
                      className="cursor-pointer w-full text-left"
                      onClick={() => {
                        router.push(
                          `/${session?.user.companyPublicId}/stakeholders`,
                        );
                      }}
                    >
                      <div className="flex items-center my-1 gap-x-2">
                        <span>
                          <RiAddCircleLine className="h-4 w-4" aria-hidden />
                        </span>
                        <div>Add a stakeholder</div>
                      </div>
                    </button>
                  </LinearCombobox>
                </div>
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
