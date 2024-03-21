import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const GeneraLDetailsField = [
  "certificateId",
  // "numberOfShares",
  // "pricePerShare",
  // "vestingSchedule",
  // "companyLegends",
  // "status",
];

export const GeneralDetails = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
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
  );
};
