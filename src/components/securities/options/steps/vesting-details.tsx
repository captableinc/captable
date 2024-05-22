"use client";

import { SpinnerIcon } from "@/components/common/icons";
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
import { toTitleCase } from "@/lib/string";
import { VestingScheduleEnum } from "@/prisma/enums";
import { useStockOptionFormValues } from "@/providers/stock-option-form-provider";
import type { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const vestingSchedule = Object.values(VestingScheduleEnum).map((val) => ({
  label: toTitleCase(val).replace("Vesting_", "").replaceAll("_", "-"),
  value: val,
}));

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

export const VestingDetails = (props: VestingDetailsProps) => {
  const { stakeholders, equityPlans } = props;

  const { next } = useStepper();
  const { setValue } = useStockOptionFormValues();
  const form = useForm<TFormSchema>({ resolver: zodResolver(formSchema) });

  const handleSubmit = (data: TFormSchema) => {
    setValue(data);
    next();
  };
  return (
    <Form {...form}>
      <div className="space-y-4">
        <form
          id="vesting-details-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid gap-4"
        >
          <FormField
            control={form.control}
            name="vestingSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vesting schedule</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Vesting" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vestingSchedule.map((vs) => (
                      <SelectItem key={vs.value} value={vs.value}>
                        {vs.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

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
                    {equityPlans?.data.length ? (
                      equityPlans?.data?.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))
                    ) : (
                      <SpinnerIcon
                        className="mx-auto my-4 w-full"
                        color="black"
                      />
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exercisePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise price</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

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
                    {stakeholders?.length ? (
                      stakeholders?.map((sh) => (
                        <SelectItem key={sh.id} value={sh.id}>
                          {sh.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SpinnerIcon
                        className="mx-auto my-4 w-full"
                        color="black"
                      />
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
        </form>

        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button type="submit" form="vesting-details-form">
            Save & Continue
          </Button>
        </StepperModalFooter>
      </div>
    </Form>
  );
};
