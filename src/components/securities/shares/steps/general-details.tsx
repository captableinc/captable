import { LoadingSpinner } from "@/components/common/LoadingSpinner";
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
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/simple-multi-select";
import {
  SecuritiesStatusEnum,
  ShareLegendsEnum,
  VestingScheduleEnum,
} from "@/prisma/enums";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const humanizeCompanyLegends = (type: string): string => {
  switch (type) {
    case ShareLegendsEnum.US_SECURITIES_ACT:
      return "Us securities act";
    case ShareLegendsEnum.TRANSFER_RESTRICTIONS:
      return "Transfer restrictions";
    case ShareLegendsEnum.SALE_AND_ROFR:
      return "Sale and Rofr";
    default:
      return "";
  }
};

export const humanizeVestingSchedule = (type: string): string => {
  switch (type) {
    case VestingScheduleEnum.VESTING_0_0_0:
      return "Immediate vesting";
    case VestingScheduleEnum.VESTING_0_0_1:
      return "1 year cliff with no vesting";
    case VestingScheduleEnum.VESTING_4_1_0:
      return "4 years vesting every month with no cliff";
    case VestingScheduleEnum.VESTING_4_1_1:
      return "4 years vesting every month with 1 year cliff";
    case VestingScheduleEnum.VESTING_4_3_1:
      return "4 years vesting every 3 months with 1 year cliff";
    case VestingScheduleEnum.VESTING_4_6_1:
      return "4 years vesting every 6 months with 1 year cliff";
    case VestingScheduleEnum.VESTING_4_12_1:
      return "4 years vesting every year with 1 year cliff";
    default:
      return "";
  }
};

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
                    {shareClasses?.data?.length ? (
                      shareClasses?.data?.map((sc) => (
                        <SelectItem key={sc.id} value={sc.id}>
                          {sc.name}
                        </SelectItem>
                      ))
                    ) : (
                      <LoadingSpinner />
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
                      ? status.map((s) => (
                          <SelectItem key={s} value={s}>
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
                  vestingSchedule.map((vs) => (
                    <SelectItem key={vs} value={vs}>
                      {humanizeVestingSchedule(vs)}
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
            <FormLabel>Company Legends</FormLabel>
            <MultiSelector onValuesChange={field.onChange} values={field.value}>
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder="Select company legends" />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {companyLegends.map((cl) => (
                    <MultiSelectorItem key={cl} value={cl}>
                      {humanizeCompanyLegends(cl)}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </FormItem>
        )}
      />
    </div>
  );
};
