import { popModal } from "@/components/modals";
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
import { camelCase } from "@/lib/utils";
import { StakeholderTypeEnum } from "@/prisma/enums";
import { api } from "@/trpc/react";
import { ZodAddStakeholderMutationSchema } from "@/trpc/routers/stakeholder-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface InvestorFormProps {
  investor?: ZodInvestorType;
}

const ZodInvestorSchema = ZodAddStakeholderMutationSchema;
type ZodInvestorType = z.infer<typeof ZodInvestorSchema>;

export const InvestorForm = ({ investor }: InvestorFormProps) => {
  const router = useRouter();

  const { mutateAsync: addStakeholderMutation } =
    api.stakeholder.addStakeholders.useMutation({
      onSuccess: ({ success, message }) => {
        if (success) {
          router.refresh();
          form.reset();
          toast.success("🎉 Successfully created!");
          popModal();
        } else {
          toast.error(`🔥 Error - ${message}`);
        }
      },
    });

  const stakeholderType =
    investor?.stakeholderType || investor?.institutionName
      ? "INSTITUTION"
      : "INDIVIDUAL";

  const form = useForm<ZodInvestorType>({
    defaultValues: {
      name: investor?.name || "",
      email: investor?.email || "",
      institutionName: investor?.institutionName || "",
      stakeholderType,
      currentRelationship: "INVESTOR",
    },
    resolver: zodResolver(ZodInvestorSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = (values: ZodInvestorType) => {
    addStakeholderMutation([values]);
  };

  const StakeholderTypeArr = Object.values(StakeholderTypeEnum);

  const investorTypeOpts = StakeholderTypeArr.map((st) => ({
    value: st,
    label: camelCase(st),
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="stakeholderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div>
                    <LinearCombobox
                      defaultOption={{ value: field.value, label: field.value }}
                      options={investorTypeOpts}
                      onValueChange={(option) => {
                        field.onChange(option.value);
                      }}
                    />
                  </div>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            {isSubmitting ? "Adding stakeholder" : "Add a stakeholder"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
