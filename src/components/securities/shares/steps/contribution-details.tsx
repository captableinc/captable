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
import { api } from "@/trpc/react";
import { useFormContext } from "react-hook-form";

export const ContributionDetailsField = [
  "capitalContribution",
  "ipContribution",
  "debtCancelled",
  "otherContributions",
  "stakeholderId",
];

export const ContributionDetails = () => {
  const form = useFormContext();
  const stakeholders = api.stakeholder.getStakeholders.useQuery();

  return (
    <div className="space-y-4">
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
                  <SelectValue placeholder="Select stakeholder" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {stakeholders?.data?.data?.length ? (
                  stakeholders?.data?.data?.map((sh) => (
                    <SelectItem key={sh.id} value={sh.id}>
                      {sh.company.name} - {sh.name}
                    </SelectItem>
                  ))
                ) : (
                  <LoadingSpinner className="mx-auto" />
                )}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="capitalContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capital contribution</FormLabel>
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
            name="ipContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intellectual property</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
            name="debtCancelled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debt cancelled</FormLabel>
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
            name="otherContributions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other contributions</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
