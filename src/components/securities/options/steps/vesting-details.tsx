"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { VestingSchedule } from "@/lib/vesting";
import { VestingScheduleEnum } from "@/prisma/enums";
import { useStockOptionFormValues } from "@/providers/stock-option-form-provider";
import type { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

const formSchema = z.object({
  equityPlanId: z.string(),
  vestingSchedule: z.nativeEnum(VestingScheduleEnum),
  exercisePrice: z.coerce.number(),
  stakeholderId: z.string(),
});

type TFormSchema = z.infer<typeof formSchema>;

interface VestingDetailsProps {
  stakeholders: RouterOutputs["stakeholder"]["getStakeholders"];
  equityPlans: RouterOutputs["equityPlan"]["getPlans"];
}

interface EmptySelectProps {
  title: string;
  description: string;
}

function EmptySelect({ title, description }: EmptySelectProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export const VestingDetails = (props: VestingDetailsProps) => {
  const { stakeholders, equityPlans } = props;

  const { next } = useStepper();
  const { setValue } = useStockOptionFormValues();
  const form = useForm<TFormSchema>({ resolver: zodResolver(formSchema) });

  const handleSubmit = (data: TFormSchema) => {
    setValue(data);
    next();
  };

  const disabled = !stakeholders.length && !equityPlans.data?.length;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="vestingSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vesting schedule</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vesting schedule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(VestingSchedule).map((vKey) => (
                      <SelectItem key={vKey} value={vKey}>
                        {VestingSchedule[vKey]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          {equityPlans.data.length ? (
            <FormField
              control={form.control}
              name="equityPlanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equity plan</FormLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equityPlans?.data?.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          ) : (
            <EmptySelect
              title="Equity plan not found"
              description="Please create an Equity Plan to continue."
            />
          )}

          <FormField
            control={form.control}
            name="exercisePrice"
            render={({ field }) => {
              const { onChange, ...rest } = field;
              return (
                <FormItem>
                  <FormLabel>Exercise price</FormLabel>
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

          {stakeholders.length ? (
            <FormField
              control={form.control}
              name="stakeholderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stakeholder</FormLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stakeholders?.map((sh) => (
                        <SelectItem key={sh.id} value={sh.id}>
                          {sh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          ) : (
            <EmptySelect
              title="Stakeholders not found"
              description="Please create an stakeholder to continue."
            />
          )}
        </div>

        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button disabled={disabled} type="submit">
            Save & Continue
          </Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
};
