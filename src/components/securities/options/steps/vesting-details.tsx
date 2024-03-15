"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useMemo } from "react";
import { VestingScheduleEnum } from "@/prisma-enums";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { SpinnerIcon } from "@/components/shared/icons";

export const VestingDetailsFields = [
  "vestingSchedule",
  "equityPlanId",
  "exercisePrice",
  "stakeholderId",
];

export const VestingDetails = () => {
  const form = useFormContext();
  const stakeholders = api.stakeholder.getStakeholders.useQuery();
  const equityPlans = api.equityPlan.getPlans.useQuery();
  const vestingSchedule = useMemo(
    () =>
      Object.values(VestingScheduleEnum).filter(
        (value) => typeof value === "string",
      ),
    [],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="vestingSchedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vesting Schedule</FormLabel>
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Vesting" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vestingSchedule?.length &&
                    vestingSchedule.map((vs, index) => (
                      <SelectItem key={index} value={vs}>
                        {vs}
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
              <FormLabel>Equity Plan</FormLabel>
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equityPlans?.data?.data.length ? (
                    equityPlans?.data?.data?.map(({ id, name }) => (
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
              <FormLabel>Exercise Price</FormLabel>
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
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stakeholders?.data?.data?.length ? (
                    stakeholders?.data?.data?.map((sh) => (
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
      </div>
    </div>
  );
};
