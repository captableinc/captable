"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

export const RelevantDatesFields = [
  "issueDate",
  "expirationDate",
  "vestingStartDate",
  "boardApprovalDate",
  "rule144Date",
];

export const RelevantDates = () => {
  const form = useFormContext();

  return (
    <>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="issueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vestingStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vesting Start Date</FormLabel>
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
              <FormLabel>Board Approval Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rule144Date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule 144 Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
