"use client";

import DatePicker from "@/components/common/date-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  StepperModalFooter,
  StepperPrev,
  useStepper,
} from "@/components/ui/stepper";
import { useAddShareFormValues } from "@/providers/add-share-form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  boardApprovalDate: z.date(),
  rule144Date: z.date(),
  issueDate: z.date(),
  vestingStartDate: z.date(),
});

type TFormSchema = z.infer<typeof formSchema>;

export const RelevantDates = () => {
  const form = useForm<TFormSchema>({ resolver: zodResolver(formSchema) });
  const { next } = useStepper();
  const { setValue } = useAddShareFormValues();

  const handleSubmit = (data: TFormSchema) => {
    setValue(data);
    next();
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="vestingStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vesting start date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="boardApprovalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board approval date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="rule144Date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule 144 date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-light" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button type="submit">Save & Continue</Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
};
