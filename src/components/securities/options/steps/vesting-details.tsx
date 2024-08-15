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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStockOptionFormValues } from "@/providers/stock-option-form-provider";
import type { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { EmptySelect } from "../../shared/EmptySelect";

const formSchema = z.object({
  equityPlanId: z.string(),
  cliffYears: z.coerce.number().min(0),
  vestingYears: z.coerce.number().min(0),
  exercisePrice: z.coerce.number(),
  stakeholderId: z.string(),
});

type TFormSchema = z.infer<typeof formSchema>;

interface VestingDetailsProps {
  stakeholders: RouterOutputs["stakeholder"]["getStakeholders"];
  equityPlans: RouterOutputs["equityPlan"]["getPlans"]["data"];
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

  const disabled = !stakeholders?.length && !equityPlans?.length;

  // const vestingSchedileOpts = Object.keys(VestingSchedule).map((vKey) => ({
  //   value: vKey,
  //   label: VestingSchedule[vKey] || "",
  // }));

  const equityPlansOpts = equityPlans?.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const stakeHolderOpts = stakeholders?.map((stake) => ({
    value: stake.id,
    label: stake.name,
  }));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="vestingYears"
                render={({ field }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FormLabel>Vesting</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Vesting starts over</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div>
                        <FormControl>
                          <NumericFormat
                            thousandSeparator
                            allowedDecimalSeparators={["%"]}
                            suffix={field.value > 1 ? " years" : " year"}
                            decimalScale={0}
                            {...rest}
                            customInput={Input}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              onChange(floatValue);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="cliffYears"
                render={({ field }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FormLabel>Cliff</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Vesting starts after</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div>
                        <FormControl>
                          <NumericFormat
                            thousandSeparator
                            allowedDecimalSeparators={["%"]}
                            decimalScale={0}
                            suffix={field.value > 1 ? " years" : " year"}
                            {...rest}
                            customInput={Input}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              onChange(floatValue);
                            }}
                          />
                        </FormControl>
                      </div>

                      <FormMessage className="text-xs font-light" />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          {equityPlans?.length ? (
            <FormField
              control={form.control}
              name="equityPlanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equity plan</FormLabel>
                  <div>
                    <LinearCombobox
                      options={equityPlansOpts}
                      onValueChange={(option) => field.onChange(option.value)}
                    />
                  </div>
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

          {stakeholders?.length ? (
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
                    />
                  </div>
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
