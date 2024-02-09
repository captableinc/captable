"use client";

import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  EquityPlanMutationSchema,
  type EquityPlanMutationType,
} from "@/trpc/routers/equity-plan/schema";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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
};

const EquityPlanForm = ({
  setOpen,
  className,
  type = "create",
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
  const { toast } = useToast();

  const form = useForm<EquityPlanMutationType>({
    resolver: zodResolver(formSchema),
    defaultValues: equityPlan,
  });

  const isSubmitting = form.formState.isSubmitting;
  const mutation = api.equityPlan.create.useMutation({
    onSuccess: async ({ success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully created"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      form.reset();
      setOpen(false);
      router.refresh();
    },
  });

  const onSubmit = async (values: EquityPlanMutationType) => {
    await mutation.mutateAsync(values);
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
                      value={field.value ? field.value : 0}
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
                      <SelectItem value="create-a-share-class">
                        Create a share class
                      </SelectItem>
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
            Create an equity plan
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EquityPlanForm;
