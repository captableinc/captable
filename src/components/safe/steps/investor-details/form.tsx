"use client";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemStyle,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StepperModalFooter,
  StepperPrev,
  useStepper,
} from "@/components/ui/stepper";
import { useFormValueUpdater } from "@/providers/form-value-provider";
import type { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SelectPrimitive from "@radix-ui/react-select";
import { RiAddCircleLine } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  capital: z.coerce.number(),
  issueDate: z.string().date(),
  boardApprovalDate: z.string().date(),
  stakeholderId: z.string(),
});

export type TFormSchema = z.infer<typeof formSchema>;
export const ADD_STAKEHOLDER = "add-stakeholder";

type TStakeholders = RouterOutputs["stakeholder"]["getStakeholders"];

interface InvestorsDetailsProps {
  stakeholders: TStakeholders;
}

export function InvestorDetailsForm({ stakeholders }: InvestorsDetailsProps) {
  const { next } = useStepper();
  const { data: session } = useSession();
  const router = useRouter();
  const setValue = useFormValueUpdater<TFormSchema>();
  const form = useForm<TFormSchema>({ resolver: zodResolver(formSchema) });

  const handleSubmit = (data: TFormSchema) => {
    next();
    setValue(data);
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
            name="capital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capital</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
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
                <FormMessage className="text-xs font-light" />
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
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    if (val === ADD_STAKEHOLDER) {
                      router.push(
                        `/${session?.user.companyPublicId}/stakeholders`,
                      );
                    } else {
                      return form.setValue("stakeholderId", val);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select stakeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    {stakeholders?.map((sh) => (
                      <SelectItem key={sh.id} value={sh.id}>
                        {sh.institutionName
                          ? `${sh.institutionName} - ${sh.name}`
                          : `${sh.name}`}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectPrimitive.Item
                      value={ADD_STAKEHOLDER}
                      className={SelectItemStyle}
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <RiAddCircleLine className="h-4 w-4" aria-hidden />
                      </span>

                      <SelectPrimitive.ItemText>
                        Add Stakeholder
                      </SelectPrimitive.ItemText>
                    </SelectPrimitive.Item>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <StakeholderDataDisplay stakeholders={stakeholders} />
        </div>
        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button type="submit">Save & Continue</Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
}

interface StakeholderDataDisplayProps {
  stakeholders: TStakeholders;
}

function StakeholderDataDisplay({ stakeholders }: StakeholderDataDisplayProps) {
  const { control } = useFormContext<TFormSchema>();
  const stakeholderId = useWatch({ control, name: "stakeholderId" }) as
    | string
    | null;

  const stakeholder = stakeholders.find((item) => item.id === stakeholderId);

  return stakeholderId ? (
    <>
      <div className="flex flex-col gap-y-2">
        <Label>Investor name</Label>
        <Input
          name="investorName"
          value={stakeholder?.name}
          type="text"
          disabled
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label>Investor email</Label>
        <Input
          name="investorEmail"
          value={stakeholder?.email}
          type="text"
          disabled
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>Investor institution name</Label>
        <Input
          name="investorInstitutionName"
          value={stakeholder?.institutionName ?? ""}
          type="text"
          disabled
        />
      </div>
    </>
  ) : null;
}
