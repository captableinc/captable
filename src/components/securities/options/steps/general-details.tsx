"use client";

import { Input } from "@/components/ui/input";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { OptionStatusEnum, OptionTypeEnum } from "@/prisma-enums";
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

export const GeneralDetailsField = [
  "grantId",
  "grantType",
  "quantity",
  "status",
];

export const GeneralDetails = () => {
  const form = useFormContext();

  const types = useMemo(
    () =>
      Object.values(OptionTypeEnum).filter(
        (value) => typeof value === "string",
      ),
    [],
  ) as string[];

  const status = useMemo(
    () =>
      Object.values(OptionStatusEnum).filter(
        (value) => typeof value === "string",
      ),
    [],
  ) as string[];

  return (
    <div className="space-y-4">
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
            {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {types
                  ? types.map((t, index) => (
                      <SelectItem key={index} value={t}>
                        {t}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {status
                  ? status.map((s, index) => (
                      <SelectItem key={index} value={s}>
                        {s}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
    </div>
  );
};
