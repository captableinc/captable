import { useFormContext } from "react-hook-form";

import { SpinnerIcon } from "@/components/shared/icons";
import {
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
  SecuritiesStatusEnum,
  ShareLegendsEnum,
  VestingScheduleEnum,
} from "@/prisma-enums";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import ReactSelect from "react-select";

export const GeneralDetailsField = [
  "certificateId",
  "status",
  "quantity",
  "pricePerShare",
  "vestingSchedule",
  "shareClassId",
  "companyLegends",
];

export const GeneralDetails = () => {
  const form = useFormContext();
  const shareClasses = api.shareClass.get.useQuery();

  const status = useMemo(
    () =>
      Object.values(SecuritiesStatusEnum).filter(
        (value) => typeof value === "string",
      ),
    [],
  ) as string[];

  const vestingSchedule = useMemo(
    () =>
      Object.values(VestingScheduleEnum).filter(
        (value) => typeof value === "string",
      ),
    [],
  ) as string[];

  const companyLegends = useMemo(
    () =>
      Object.values(ShareLegendsEnum).filter(
        (value) => typeof value === "string",
      ),
    [],
  ) as string[];

  return (
    <div className="space-y-4">
      <div className="flex-1">
        <FormField
          control={form.control}
          name="certificateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate ID</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-light" />
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="shareClassId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share class</FormLabel>
                {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select stakeholder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shareClasses?.data?.data?.length ? (
                      shareClasses?.data?.data?.map((sc) => (
                        <SelectItem key={sc.id} value={sc.id}>
                          {sc.name}
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
        <div className="flex-1">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
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
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1">
          <FormField
            control={form.control}
            name="pricePerShare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per share</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="vestingSchedule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vesting schedule</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
            >
              <FormControl>
                <SelectTrigger>
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
        name="companyLegends"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company legends</FormLabel>
            <ReactSelect
              isMulti
              options={companyLegends.map((cl) => ({ label: cl, value: cl }))}
              value={
                field.value
                  ? (field.value as string[]).map((v) => ({
                      label: v,
                      value: v,
                    }))
                  : []
              }
              onChange={(selectedOptions) => {
                const values = selectedOptions.map((option) => option.value);
                field.onChange(values);
              }}
            />
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
    </div>
  );
};
