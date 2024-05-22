"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import type { ShareClassMutationType } from "@/trpc/routers/share-class/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  EquityPlanMutationSchema,
  type EquityPlanMutationType,
} from "@/trpc/routers/equity-plan/schema";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = EquityPlanMutationSchema;

type EquityFormType = {
  type?: string;
  className?: string;
  setOpen: (val: boolean) => void;
  equityPlan?: EquityPlanMutationType;
  shareClasses: ShareClassMutationType[];
};

const EquityPlanForm = ({
  setOpen,
  type = "create",
  shareClasses,
  equityPlan = {
    id: "",
    name: "",
    boardApprovalDate: new Date(),
    planEffectiveDate: null,
    initialSharesReserved: 0,
    defaultCancellatonBehavior: "RETURN_TO_POOL",
    shareClassId: "",
    comments: "",
  },
}: EquityFormType) => {
  const router = useRouter();
  const form = useForm<EquityPlanMutationType>({
    resolver: zodResolver(formSchema),
    defaultValues: equityPlan,
  });

  const isSubmitting = form.formState.isSubmitting;
  const createMutation = api.equityPlan.create.useMutation({
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }

      form.reset();
      setOpen(false);
      router.refresh();
    },
  });

  const updateMutation = api.equityPlan.update.useMutation({
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }

      form.reset();
      setOpen(false);
      router.refresh();
    },
  });

  const onSubmit = async (values: EquityPlanMutationType) => {
    type === "create"
      ? await createMutation.mutateAsync(values)
      : await updateMutation.mutateAsync(values);
  };

  const parseBigInt = (value: number) => {
    return Number(value);
  };

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
                  <FormLabel>Equity plan name</FormLabel>
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
              name="initialSharesReserved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial reserved shares</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={parseBigInt(field.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="boardApprovalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board approval date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="planEffectiveDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan effective date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="shareClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a share class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a share class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>
                          {shareClasses.length > 0
                            ? "Share classes"
                            : "No share classes"}
                        </SelectLabel>

                        {shareClasses.map((shareClass) => (
                          <SelectItem
                            key={shareClass.id}
                            value={shareClass.id as string}
                          >
                            {shareClass.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="defaultCancellatonBehavior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default cancellation behavior</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a behavior" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RETIRE">Retire</SelectItem>
                      <SelectItem value="RETURN_TO_POOL">
                        Return to pool
                      </SelectItem>
                      <SelectItem value="HOLD_AS_CAPITAL_STOCK">
                        Hold as capital stock
                      </SelectItem>
                      <SelectItem value="DEFINED_PER_PLAN_SECURITY">
                        Defined per plan security
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-6">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-light" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            loading={isSubmitting}
            loadingText="Submitting..."
            type="submit"
          >
            {
              {
                create: "Create equity plan",
                update: "Update equity plan",
              }[type]
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EquityPlanForm;
